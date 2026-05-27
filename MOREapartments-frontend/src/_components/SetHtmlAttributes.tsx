"use client";

import { useEffect } from "react";

type Props = {
  locale: string;
};

function SetHtmlAttributes({ locale }: Props) {
  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "he" ? "rtl" : "ltr";
  }, [locale]);

  return null;
}

export default SetHtmlAttributes;
