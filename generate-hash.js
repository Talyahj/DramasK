const bcrypt = require('bcryptjs');

async function generateHash() {
  const password = 'password123';
  
  // Vous pouvez ajuster le coût du hachage (10 est la valeur par défaut)
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  
  console.log('Mot de passe:', password);
  console.log('Hash généré:', hash);
}

generateHash();