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