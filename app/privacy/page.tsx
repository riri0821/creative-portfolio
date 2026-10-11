import LegalPage from "@/components/LegalPage";

export const metadata = { title: "Privacy Policy · Tamara" };

export default function Privacy() {
  return (
    <LegalPage title="PRIVACY_POLICY.txt">
      <p>
        This site does not use tracking cookies or analytics. Your view choice (Desktop or Normal) is saved only in your
        own browser.
      </p>
      <p>
        If you send a message through the contact form, your name, email and message are used only to reply to you. They
        are never sold or shared.
      </p>
      <p>To ask for your message to be deleted, reach out through the contact form or LinkedIn.</p>
    </LegalPage>
  );
}
