import LegalPage from "@/components/LegalPage";

export const metadata = { title: "Terms & Conditions · Tamara" };

export default function Terms() {
  return (
    <LegalPage title="TERMS_AND_CONDITIONS.txt">
      <p>This is a personal portfolio. By using it you agree to these terms.</p>
      <p>
        All projects, writing, images and artwork on this site belong to Tamara unless stated otherwise. Please do not
        copy or reuse them without permission.
      </p>
      <p>
        The design is a fan-made theme inspired by Needy Streamer Overload. It is not affiliated with or endorsed by its
        creators.
      </p>
      <p>Links to other websites are provided for convenience. I am not responsible for their content.</p>
      <p>The site is provided as is, and these terms may be updated at any time.</p>
    </LegalPage>
  );
}
