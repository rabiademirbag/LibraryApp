/**
 * Formats a date string to localized format (DD.MM.YYYY)
 * @param {string} dateString - The date string to format
 * @returns {string} - Formatted date string or empty string if invalid
 */
export const formatDate = (dateString) => {
  // Eğer dateString boşsa, boş bir string döndür
  if (!dateString) return ""

  try {
    // dateString'i bir Date nesnesine dönüştür
    const date = new Date(dateString)

    // Geçerli bir tarih mi kontrol et
    if (isNaN(date.getTime())) return ""

    // Tarihi Türkçe formatta döndür (gün.ay.yıl)
    return date.toLocaleDateString("tr-TR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  } catch (error) {
    // Hata durumunda hata mesajını konsola yazdır
    console.error("Date formatting error:", error)
    return ""
  }
}

/**
 * Checks if a date string is valid
 * @param {string} dateString - The date string to check
 * @returns {boolean} - Whether the date is valid
 */
export const isValidDate = (dateString) => {
  // Konsola tarih bilgisini yazdır
  console.log("Checking date validity:", dateString, "Type:", typeof dateString)

  // Null, undefined veya boş string kontrolü
  if (!dateString) return false

  // API'den gelen özel tarih değerlerini kontrol et
  if (
    dateString === "0001-01-01" ||
    dateString === "0001-01-01T00:00:00" ||
    dateString === "1-1-1" ||
    dateString === ""
  ) {
    return false
  }

  // dateString'i bir Date nesnesine dönüştür
  const date = new Date(dateString)
  // Tarih geçerli mi diye kontrol et
  const isValid = !isNaN(date.getTime())

  // Sonucu konsola yazdır
  console.log("Date parsed:", date, "Is valid:", isValid)

  return isValid
}

/**
 * Calculates days remaining until a date
 * @param {string} dateString - Target date string
 * @returns {number} - Days remaining (negative if past)
 */
export const getDaysRemaining = (dateString) => {
  // Eğer tarih geçerli değilse, null döndür
  if (!isValidDate(dateString)) return null

  // Bugünün tarihini al
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Hedef tarihi al
  const targetDate = new Date(dateString)
  targetDate.setHours(0, 0, 0, 0)

  // Bugün ile hedef tarih arasındaki farkı hesapla
  const diffTime = targetDate.getTime() - today.getTime()
  // Farkı gün olarak döndür
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}
