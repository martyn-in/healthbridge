import { POST as assistPost } from '../emergency/assist/route';

export async function POST(req: Request) {
  return assistPost(req);
}
