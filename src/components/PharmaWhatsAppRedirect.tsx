import {useEffect} from "react";
import {PHARMA_WHATSAPP_BRAND,PHARMA_WHATSAPP_PHONE,PHARMA_WHATSAPP_MESSAGE,PHARMA_WHATSAPP_URL} from "@/lib/pharma-whatsapp";
import {useHead} from "@/lib/head";

export default function PharmaWhatsAppRedirect(){
  useHead({title:"Vivka Pharma — WhatsApp",description:"Atendimento da farmácia pelo WhatsApp.",path:"/whatsapp",noindex:true});
  const suppliedText = typeof window === "undefined" ? null : new URLSearchParams(window.location.search).get("text");
  const message = suppliedText?.trim().slice(0,2000) || PHARMA_WHATSAPP_MESSAGE;
  const url = suppliedText ? `https://wa.me/${PHARMA_WHATSAPP_PHONE}?text=${encodeURIComponent(message)}` : PHARMA_WHATSAPP_URL;
  useEffect(()=>{window.location.replace(url);},[url]);
  return <main className="flex min-h-screen items-center justify-center bg-background px-6 py-12 text-foreground"><div className="max-w-md space-y-6 text-center">
    <p className="text-sm uppercase tracking-widest">{PHARMA_WHATSAPP_BRAND} Pharma</p>
    <h1 className="text-3xl font-semibold">Abrindo o WhatsApp…</h1>
    <p>Sua mensagem está pronta. Se o redirecionamento não abrir, use o botão abaixo.</p>
    <blockquote className="rounded-xl border border-current/20 p-4 text-sm">{message}</blockquote>
    <a className="inline-flex rounded-full bg-[#25D366] px-6 py-3 font-semibold text-white" href={url}>Abrir WhatsApp</a>
    <a className="block text-sm underline" href="/pharma">Voltar para o Pharma</a>
  </div></main>;
}
