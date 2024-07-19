import db from "../db.server";

export async function getTobaccoForm(id) {
  const form = await db.tobaccoform.findFirst({ where: { id } });
  if(!form){
    return null
  }
  return form
  }