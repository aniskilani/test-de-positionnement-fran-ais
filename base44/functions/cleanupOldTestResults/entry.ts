import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // Date limite : il y a 2 ans
    const twoYearsAgo = new Date();
    twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);

    // Récupérer tous les résultats
    const allResults = await base44.asServiceRole.entities.TestResult.list();

    let deletedCount = 0;

    // Supprimer ceux de plus de 2 ans
    for (const result of allResults) {
      const createdDate = new Date(result.created_date);
      
      if (createdDate < twoYearsAgo) {
        await base44.asServiceRole.entities.TestResult.delete(result.id);
        deletedCount++;
      }
    }

    // Faire pareil pour FreeTestSession
    const allFreeSessions = await base44.asServiceRole.entities.FreeTestSession.list();
    
    for (const session of allFreeSessions) {
      const createdDate = new Date(session.created_date);
      
      if (createdDate < twoYearsAgo) {
        await base44.asServiceRole.entities.FreeTestSession.delete(session.id);
        deletedCount++;
      }
    }

    // Faire pareil pour TrainerSession
    const allTrainerSessions = await base44.asServiceRole.entities.TrainerSession.list();
    
    for (const session of allTrainerSessions) {
      const createdDate = new Date(session.created_date);
      
      if (createdDate < twoYearsAgo) {
        await base44.asServiceRole.entities.TrainerSession.delete(session.id);
        deletedCount++;
      }
    }

    return Response.json({ 
      success: true,
      message: `Suppression automatique RGPD terminée`,
      deleted_count: deletedCount,
      cutoff_date: twoYearsAgo.toISOString()
    });
  } catch (error) {
    console.error('Erreur cleanup:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});