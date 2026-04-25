const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
require('dotenv').config({ path: '.env.local' })

const MONGODB_URI = process.env.MONGODB_URI
const adminEmail = 'admin@template.com'
const adminPassword = 'Admin@123456'
const adminName = 'Admin'

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: String,
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

const User = mongoose.model('User', UserSchema)

async function createAdmin() {
  try {
    console.log('🔗 Connexion à MongoDB...')
    await mongoose.connect(MONGODB_URI)
    console.log('✅ Connecté!')

    // Vérifier si le compte existe
    const existingAdmin = await User.findOne({ email: adminEmail })
    if (existingAdmin) {
      console.log('⚠️  Un compte admin existe déjà avec cet email')
      console.log('Email:', existingAdmin.email)
      console.log('Vous pouvez le réinitialiser si nécessaire')
      process.exit(0)
    }

    // Hash du password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(adminPassword, salt)

    // Créer l'admin
    const admin = await User.create({
      email: adminEmail,
      password: hashedPassword,
      name: adminName,
      role: 'admin',
    })

    console.log('\n✅ Compte admin créé avec succès!\n')
    console.log('📧 Email:', adminEmail)
    console.log('🔑 Mot de passe:', adminPassword)
    console.log('👤 Nom:', adminName)
    console.log('🔒 Rôle:', 'admin')
    console.log('\n🚀 Vous pouvez maintenant vous connecter à:')
    console.log('   http://localhost:3001/admin/login\n')

    process.exit(0)
  } catch (error) {
    console.error('❌ Erreur:', error.message)
    process.exit(1)
  }
}

createAdmin()
