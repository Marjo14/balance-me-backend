const { PrismaClient } = require('@prisma/client');
const { calculateNewBalances } = require('../services/financeLogic');

const prisma = new PrismaClient();

// Logic to handle creating an intention
exports.createIntention = async (req, res) => {
  const { label, amount, emotion } = req.body;

  try {
    const result = await prisma.$transaction(async (tx) => {
      // 1. Fetch current statistics
      const currentStats = await tx.userStats.findFirst();
      if (!currentStats) {
        throw new Error("Account not initialized.");
      }

      // 2. Business logic
      const updatedData = calculateNewBalances(currentStats, amount, 'CREATE');

      // 3. Database operations
      const newIntention = await tx.intention.create({
        data: { label, amount, status: 'INTENTION', emotion }
      });

      const updatedStats = await tx.userStats.update({
        where: { id: currentStats.id },
        data: { projectedBalance: updatedData.projectedBalance }
      });

      return { newIntention, updatedStats };
    });

    res.status(201).json({ message: "Intention recorded!", data: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Function to CONFIRM the expense (REALIZE)
exports.realizeIntention = async (req, res) => {
  const { id } = req.params; // We get the ID from the URL

  try {
    const result = await prisma.$transaction(async (tx) => {
      const intention = await tx.intention.findUnique({ where: { id } });
      const currentStats = await tx.userStats.findFirst();

      if (!intention || intention.status !== 'INTENTION') {
        throw new Error("Intention not found or already processed.");
      }

      // Logic: Real balance decreases to match the projection
      const updatedData = calculateNewBalances(currentStats, intention.amount, 'REALIZE');

      const updatedIntention = await tx.intention.update({
        where: { id },
        data: { status: 'REALISEE' }
      });

      const updatedStats = await tx.userStats.update({
        where: { id: currentStats.id },
        data: { realBalance: updatedData.realBalance }
      });

      return { updatedIntention, updatedStats };
    });

    res.json({ message: "Expense realized!", data: result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Function to CANCEL the expense (ABORT = Victory)
exports.abortIntention = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await prisma.$transaction(async (tx) => {
      const intention = await tx.intention.findUnique({ where: { id } });
      const currentStats = await tx.userStats.findFirst();

      if (!intention || intention.status !== 'INTENTION') {
        throw new Error("Intention not found.");
      }

      // Logic: Projected balance goes back up + savings increase
      const updatedData = calculateNewBalances(currentStats, intention.amount, 'ABORT');

      const updatedIntention = await tx.intention.update({
        where: { id },
        data: { status: 'AVORTEE' }
      });

      const updatedStats = await tx.userStats.update({
        where: { id: currentStats.id },
        data: { 
          projectedBalance: updatedData.projectedBalance,
          totalSaved: updatedData.totalSaved 
        }
      });

      return { updatedIntention, updatedStats };
    });

    res.json({ message: "Victory recorded! Savings updated.", data: result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Check that the name is EXACTLY "getUserStats"
exports.getUserStats = async (req, res) => {
  try {
    const stats = await prisma.userStats.findFirst();
    if (!stats) return res.status(404).json({ error: "Stats not found." });
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Function to list all intentions (to see IDs and amounts)
exports.getAllIntentions = async (req, res) => {
  try {
    const intentions = await prisma.intention.findMany({
      orderBy: { createdAt: 'desc' } // Les plus récentes en premier
    });
    res.json(intentions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteIntention = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.intention.delete({ where: { id } });
    res.json({ message: "Intention supprimée avec succès." });
  } catch (error) {
    res.status(404).json({ error: "Intention non trouvée." });
  }
};