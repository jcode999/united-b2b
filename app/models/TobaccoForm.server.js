import db from "../db.server";

export async function getTobaccoForms() {
  const forms = await db.tobaccoForm.findMany();
  if(!forms){
    return null
  }
  return forms
  };

export async function getTobaccoForm(id){

  const form = await db.tobaccoForm.findFirst({where:{id}});
  
  if(!form){
    return null
  }

  return form


}