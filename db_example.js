const { data, error } = await supabase
  .from('recipes')
  .select('*')
  .eq('id', recipeId)
  .single();

if (data) {
  renderRecipe(data);
}
