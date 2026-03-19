const { PrismaClient } = require('@prisma/client');
const { calculateNewBalances } = require('../services/financeLogic');

const prisma = new PrismaClient();

/**
 * Handle creating a new financial intention
 */
exports.createIntention = async (req, res) => {
  const { label, amount, emotion } = req.body;
  const userId = req.user.id; // Retrieved via auth middleware

  try {
    const result = await prisma.$transaction(async (tx) => {
      // 1. Fetch or initialize statistics for this specific user
      let currentStats = await tx.userStats.findUnique({ where: { userId } });
      
      if (!currentStats) {
        currentStats = await tx.userStats.create({
          data: { 
            userId, 
            realBalance: 1000, 
            projectedBalance: 1000 
          } 
        });
      }

      // 2. Business logic calculation
      const updatedData = calculateNewBalances(currentStats, amount, 'CREATE');

      // 3. Database operations
      const newIntention = await tx.intention.create({
        data: { label, amount, status: 'INTENTION', emotion, userId }
      });

      const updatedStats = await tx.userStats.update({
        where: { userId },
        data: { projectedBalance: updatedData.projectedBalance }
      });

      return { newIntention, updatedStats };
    });

    res.status(201).json({ message: "Intention successfully recorded!", data: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Confirm and realize an expense
 */
exports.realizeIntention = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const result = await prisma.$transaction(async (tx) => {
      const intention = await tx.intention.findFirst({ where: { id, userId } });
      const currentStats = await tx.userStats.findUnique({ where: { userId } });

      if (!intention || intention.status !== 'INTENTION') {
        throw new Error("Intention not found or already processed.");
      }

      const updatedData = calculateNewBalances(currentStats, intention.amount, 'REALIZE');

      const updatedIntention = await tx.intention.update({
        where: { id },
        data: { status: 'REALISEE' }
      });

      const updatedStats = await tx.userStats.update({
        where: { userId },
        data: { realBalance: updatedData.realBalance }
      });

      return { updatedIntention, updatedStats };
    });

    res.json({ message: "Expense realized successfully!", data: result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * Abort an intention (Financial Victory)
 */
exports.abortIntention = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const result = await prisma.$transaction(async (tx) => {
      const intention = await tx.intention.findFirst({ where: { id, userId } });
      const currentStats = await tx.userStats.findUnique({ where: { userId } });

      if (!intention || intention.status !== 'INTENTION') {
        throw new Error("Intention not found or invalid status.");
      }

      const updatedData = calculateNewBalances(currentStats, intention.amount, 'ABORT');

      const updatedIntention = await tx.intention.update({
        where: { id },
        data: { status: 'AVORTEE' }
      });

      const updatedStats = await tx.userStats.update({
        where: { userId },
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

/**
 * Retrieve current user financial statistics
 */
exports.getUserStats = async (req, res) => {
  try {
    const stats = await prisma.userStats.findUnique({ 
        where: { userId: req.user.id } 
    });
    if (!stats) return res.status(404).json({ error: "Statistics not found for this user." });
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * List all intentions for the authenticated user
 */
exports.getAllIntentions = async (req, res) => {
  try {
    const intentions = await prisma.intention.findMany({
      where: { userId: req.user.id }, 
      orderBy: { createdAt: 'desc' }
    });
    res.json(intentions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Delete a specific intention
 */
exports.deleteIntention = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.intention.delete({ 
        where: { id, userId: req.user.id } 
    });
    res.json({ message: "Intention deleted successfully." });
  } catch (error) {
    res.status(404).json({ error: "Intention not found or unauthorized." });
  }
};