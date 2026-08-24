import { useEffect } from "react";

/**
 * Sets the browser tab title for the current page.
 */
const useDocumentTitle = (title) => {
  useEffect(() => {
    document.title = title ? `${title} | 1ShopNepal` : "1ShopNepal";
  }, [title]);
};

export default useDocumentTitle;
