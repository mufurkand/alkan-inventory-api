function replaceTurkishChars(str: string): string {
  const turkishChars: { [key: string]: string } = {
    ç: 'c',
    Ç: 'C',
    ğ: 'g',
    Ğ: 'G',
    ı: 'i',
    İ: 'I',
    ş: 's',
    Ş: 'S',
    ö: 'o',
    Ö: 'O',
    ü: 'u',
    Ü: 'U',
  };

  return str.replace(/[çÇğĞıİşŞöÖüÜ]/g, (char) => turkishChars[char] || char);
}

function removeSpecialChars(str: string): string {
  return str.replace(/[^a-zA-Z0-9]/g, '');
}

function constructSearchQuery(searchQuery: string) {
  if (!searchQuery) {
    return {};
  }

  const normalizedQuery = replaceTurkishChars(searchQuery);
  const cleanedQuery = removeSpecialChars(normalizedQuery);
  const normalizedAndCleanedQuery = removeSpecialChars(normalizedQuery);

  return {
    OR: [
      { partNumber: { contains: searchQuery, mode: 'insensitive' } },
      { description: { contains: searchQuery, mode: 'insensitive' } },
      { partNumber: { contains: normalizedQuery, mode: 'insensitive' } },
      { description: { contains: normalizedQuery, mode: 'insensitive' } },
      { partNumber: { contains: cleanedQuery, mode: 'insensitive' } },
      { description: { contains: cleanedQuery, mode: 'insensitive' } },
      {
        partNumber: {
          contains: normalizedAndCleanedQuery,
          mode: 'insensitive',
        },
      },
      {
        description: {
          contains: normalizedAndCleanedQuery,
          mode: 'insensitive',
        },
      },
    ],
  };
}

export { constructSearchQuery };
