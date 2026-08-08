import { EmergencyGuidanceCardData, MedicalKnowledgeChunk } from './emergencyKnowledgeBase';
import { EmergencyIntent } from './emergencyNormalizer';

export interface VectorSearchResult {
  chunk: MedicalKnowledgeChunk;
  score: number;
}

export interface CorpusData {
  docCount: number;
  idfMap: Record<string, number>;
  vocabulary: string[];
  documents: (MedicalKnowledgeChunk & { vector: Record<string, number> })[];
}

// Fallback bundled corpus data for zero-network environments if fetch isn't completed yet
const EMBEDDED_CORPUS: CorpusData = {
  docCount: 9,
  idfMap: {
    snakebite: 1.8, cobra: 2.2, viper: 2.2, krait: 2.2, bite: 1.5, limb: 1.5,
    burn: 1.8, water: 1.5, cool: 1.8, choking: 2.0, cough: 1.8, heimlich: 2.2,
    bleeding: 1.8, pressure: 1.5, wound: 1.5, poison: 2.0, chemical: 1.8,
    seizure: 2.0, convulsion: 2.2, stroke: 2.0, chest: 1.8, pain: 1.5, CPR: 2.2,
  },
  vocabulary: ['snakebite', 'cobra', 'burn', 'choking', 'bleeding', 'poison', 'seizure', 'stroke', 'chest'],
  documents: [
    {
      id: 'who-snakebite-2016-01',
      source: 'World Health Organization (WHO)',
      title: 'WHO Guidelines for the Management of Snakebites',
      authority: 'World Health Organization',
      publicationDate: '2016-04-15',
      section: 'First Aid & Pre-Hospital Care',
      emergencyType: 'SNAKE_BITE',
      countryOrRegion: 'Global / South-East Asia',
      documentVersion: '2nd Edition',
      sourceUrl: 'https://www.who.int/publications/i/item/9789290225300',
      content: `Immobilize the affected limb using a broad bandage or splint. Keep the patient completely still and calm to slow venom circulation. Transport immediately to a healthcare facility equipped with antivenom. Never cut the bite wound, suction venom, apply arterial tourniquets, ice, or herbal home remedies. Venomous snakebites from cobras, vipers, or kraits require rapid hospital evaluation.`,
      immediateActions: [
        'Call emergency services (112 / 108) or arrange immediate transport to a hospital with antivenom.',
        'Keep the patient completely still, calm, and immobile to slow venom spreading.',
        'Immobilize the bitten limb with a splint or loose sling at or slightly below heart level.',
        'Remove rings, watches, shoes, and tight clothing before swelling starts.',
      ],
      doNotDo: [
        'DO NOT cut, incise, or slash the bite wound.',
        'DO NOT attempt suction by mouth, pump, or vacuum device.',
        'DO NOT apply tight arterial tourniquets or tight bands.',
        'DO NOT apply ice, cold packs, or electric shocks.',
        'DO NOT give herbal remedies, alcohol, or unverified home treatments.',
      ],
      warningSigns: [
        'Difficulty breathing or swallowing',
        'Drooping eyelids or blurred vision',
        'Rapid swelling or severe localized pain',
        'Spontaneous bleeding from gums or nose',
      ],
      vector: { snakebite: 0.6, cobra: 0.5, bite: 0.4, limb: 0.3 },
    },
  ],
};

let cachedCorpus: CorpusData | null = null;

/**
 * Loads precomputed vector index asset from public/data/emergency-corpus.json
 */
export async function loadEmergencyCorpus(): Promise<CorpusData> {
  if (cachedCorpus) return cachedCorpus;

  try {
    const res = await fetch('/data/emergency-corpus.json');
    if (res.ok) {
      const data: CorpusData = await res.json();
      if (data && data.documents && data.documents.length > 0) {
        cachedCorpus = data;
        return data;
      }
    }
  } catch (err) {
    console.warn('[Local Vector Search] Failed to fetch emergency-corpus.json asset, falling back to embedded corpus:', err);
  }

  cachedCorpus = EMBEDDED_CORPUS;
  return EMBEDDED_CORPUS;
}

/**
 * Tokenizes text query into lowercase clean word tokens
 */
function tokenizeQuery(query: string): string[] {
  return query
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2);
}

/**
 * Computes query TF-IDF vector & cosine similarity dot products against vector index
 */
export function performLocalVectorSearch(
  query: string,
  corpus: CorpusData,
  topK: number = 3
): VectorSearchResult[] {
  const tokens = tokenizeQuery(query);
  if (tokens.length === 0) return [];

  // Compute term frequency for query
  const queryTf: Record<string, number> = {};
  tokens.forEach((t) => {
    queryTf[t] = (queryTf[t] || 0) + 1;
  });

  // Calculate TF-IDF weight vector for query
  const queryVector: Record<string, number> = {};
  let querySumSq = 0;

  Object.keys(queryTf).forEach((term) => {
    const tf = queryTf[term] / tokens.length;
    // Boost matching terms if present in corpus idf map
    const idf = corpus.idfMap[term] || (term.length > 4 ? 1.5 : 1.0);
    const weight = tf * idf;
    queryVector[term] = weight;
    querySumSq += weight * weight;
  });

  const queryMag = Math.sqrt(querySumSq) || 1.0;
  const normalizedQueryVector: Record<string, number> = {};
  Object.keys(queryVector).forEach((term) => {
    normalizedQueryVector[term] = queryVector[term] / queryMag;
  });

  // Calculate Cosine Similarity Dot Product against each precomputed document vector
  const results: VectorSearchResult[] = [];

  corpus.documents.forEach((doc) => {
    let dotProduct = 0;

    // Direct term match cosine dot product
    Object.keys(normalizedQueryVector).forEach((term) => {
      if (doc.vector[term]) {
        dotProduct += normalizedQueryVector[term] * doc.vector[term];
      }
    });

    // Substring / Synonym semantic boost
    const docFullText = `${doc.title} ${doc.section} ${doc.content}`.toLowerCase();
    tokens.forEach((t) => {
      if (docFullText.includes(t)) {
        dotProduct += 0.08;
      }
    });

    // Cap score at 1.0
    const finalScore = Math.min(1.0, Math.round(dotProduct * 100) / 100);

    results.push({
      chunk: doc,
      score: finalScore,
    });
  });

  // Sort descending by similarity score
  results.sort((a, b) => b.score - a.score);
  return results.slice(0, topK);
}

/**
 * Builds evidence-grounded Emergency Guidance Card from vector search results
 */
export function buildGuidanceFromVectorResults(
  query: string,
  results: VectorSearchResult[],
  minConfidenceThreshold: number = 0.15
): { success: boolean; guidance: EmergencyGuidanceCardData | null; message?: string } {
  if (results.length === 0 || results[0].score < minConfidenceThreshold) {
    return {
      success: false,
      guidance: null,
      message: 'Reliable guidance could not be identified for this query. Contact emergency medical services (112 / 108) immediately.',
    };
  }

  const topMatch = results[0];
  const chunk = topMatch.chunk;

  const guidanceCard: EmergencyGuidanceCardData = {
    emergencyType: chunk.emergencyType || 'UNKNOWN',
    severity: 'EMERGENCY',
    headline: `Evidence-Based Guidance — ${chunk.title}`,
    callEmergencyServices: true,
    immediateActions: chunk.immediateActions || [
      'Call emergency services (112 / 108) immediately.',
      'Keep patient calm, sitting or lying down comfortably.',
      'Transport directly to nearest emergency medical facility.',
    ],
    doNotDo: chunk.doNotDo || [
      'DO NOT give unverified home remedies or oral liquids if unalert.',
      'DO NOT delay seeking professional hospital medical care.',
    ],
    warningSigns: chunk.warningSigns || [
      'Loss of consciousness or unresponsiveness',
      'Severe respiratory distress or blue discoloration',
    ],
    sourceTitles: results.map((r) => `${r.chunk.source} — ${r.chunk.title} (${r.chunk.section})`),
    sourceUrls: results.map((r) => r.chunk.sourceUrl),
    retrievalConfidence: topMatch.score,
  };

  return {
    success: true,
    guidance: guidanceCard,
  };
}
