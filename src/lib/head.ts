import { useEffect } from "react";
import { BASE_URL } from "@/data/produtos";

type HeadOptions = {
  title: string;
  description: string;
  path: string;
  ogType?: "website" | "product";
  ogImage?: string;
  jsonLd?: object;
};

function setMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

/* SEO por rota (SPA): título, description, canonical, Open Graph e JSON-LD. */
export function useHead({ title, description, path, ogType = "website", ogImage, jsonLd }: HeadOptions) {
  useEffect(() => {
    const url = `${BASE_URL}${path}`;
    document.title = title;
    setMeta("name", "description", description);
    setMeta("property", "og:title", title);
    setMeta("property", "og:description", description);
    setMeta("property", "og:type", ogType);
    setMeta("property", "og:url", url);
    setMeta("property", "og:locale", "pt_BR");
    setMeta("property", "og:site_name", "Vivka");
    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", title);
    setMeta("name", "twitter:description", description);
    if (ogImage) setMeta("property", "og:image", `${BASE_URL}${ogImage}`);
    setLink("canonical", url);

    let script: HTMLScriptElement | null = null;
    if (jsonLd) {
      script = document.createElement("script");
      script.type = "application/ld+json";
      script.text = JSON.stringify(jsonLd);
      document.head.appendChild(script);
    }
    return () => {
      script?.remove();
    };
  }, [title, description, path, ogType, ogImage, jsonLd]);
}
