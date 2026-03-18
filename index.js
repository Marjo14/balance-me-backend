const express = require('express');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();
const PORT = 3000;

app.use(express.json());

// 1. Route de test simple
app.get('/', (req, res) => {
  res.send('🚀 Serveur BalanceMe opérationnel !');
});

// 2. Route pour tester la création d'une intention dans Supabase
app.post('/test-add', async (req, res) => {
  try {
    const nouvelleIntention = await prisma.intention.create({
      data: {
        label: "Café test",
        amount: 3.50,
        status: "INTENTION",
        emotion: "Envie matinale"
      }
    });
    res.json({ message: "Succès !", data: nouvelleIntention });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Serveur lancé sur http://localhost:${PORT}`);
});