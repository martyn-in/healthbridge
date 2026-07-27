import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { patientId, location, contacts } = await req.json();

    // Loop through emergency contacts and send emails (since Twilio needs verified numbers, we use Resend for email alerts)
    for (const contact of contacts) {
      await resend.emails.send({
        from: "HealthBridge Emergency <emergency@healthbridge.com>",
        to: contact.email,
        subject: `EMERGENCY ALERT from your contact`,
        html: `<p><strong>EMERGENCY ALERT</strong></p>
               <p>Your emergency contact has triggered an SOS alert.</p>
               <p>Last known location coordinates: ${location?.lat}, ${location?.lng}</p>
               <p><a href="https://maps.google.com/?q=${location?.lat},${location?.lng}">View on Google Maps</a></p>`,
      });
    }

    return NextResponse.json({ success: true, message: "Emergency alerts dispatched" });
  } catch (error: any) {
    console.error("Emergency Alert Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
