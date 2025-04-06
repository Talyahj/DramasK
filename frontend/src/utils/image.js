/**
 * Utilitaire pour formater les noms d'images
 */

/**
 * Formate le titre d'un drama pour l'utiliser comme nom de fichier image
 * @param {string} title - Le titre du drama à formater
 * @returns {string} Le nom de fichier formaté
 */
export function formatImageName(title) {
    return title.toLowerCase()
      .replace(/[^a-z0-9\- ]/g, '')  // Permet de conserver les tirets
      .replace(/ /g, '-')            // Remplacer les espaces par des traits d'union
      .replace(/:/g, '')             // Supprimer les deux-points
      .replace(/-{2,}/g, '-');       // Remplacer les tirets multiples par un seul
  }
  
  /**
   * Gère les erreurs de chargement d'image en remplaçant par une image par défaut
   * @param {Event} event - L'événement d'erreur
   * @param {string} title - Le titre du drama pour le logging
   */
  export function handleImageError(event, title) {
    // Si l'image ne peut pas être chargée, remplacer par une image par défaut
    event.target.src = "/img/default-drama.jpg";
    console.log(`Image pour ${title} non trouvée, utilisation de l'image par défaut`);
  }