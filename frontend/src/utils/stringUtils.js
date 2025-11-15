export const cleanString = (str) => {
    if (typeof str !== "string") return "";
    return str
      .normalize("NFD") 
      .replace(/[\u0300-\u036f]/g, "") 
      .replace(/\s+/g, "")
      .toLowerCase();
  };