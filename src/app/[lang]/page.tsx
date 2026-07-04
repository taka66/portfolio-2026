import { Stage } from "@/components/Stage";
import { toLocale } from "@/i18n/config";

export default async function Home(props: { params: Promise<{ lang: string }> }) {
  const lang = toLocale((await props.params).lang);
  return <Stage lang={lang} />;
}
