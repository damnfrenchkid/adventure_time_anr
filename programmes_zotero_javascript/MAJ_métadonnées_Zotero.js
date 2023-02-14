// Récupérez la liste des éléments sélectionnés
var items = Zotero.getActiveZoteroPane().getSelectedItems();

// Pour chaque élément sélectionné
for (let item of items) {
  // Créez un identifiant pour la recherche en ligne
  let identifier = {
    itemType: "journalArticle",
    DOI: item.getField('DOI')
  };
  // Créez un objet de traduction
  var translate = new Zotero.Translate.Search();
  // Définissez l'identifiant pour la recherche en ligne
  translate.setIdentifier(identifier);
  // Récupérez les traducteurs disponibles
  let translators = await translate.getTranslators();
  // Définissez le traducteur à utiliser
  translate.setTranslator(translators);
  // Effectuez la recherche en ligne et récupérez les résultats
  let newItems = await translate.translate();
  // Récupérez le premier élément trouvé
  let newItem = newItems[0];

  // Mettez à jour l'élément de Zotero avec les informations de l'élément trouvé
  function update(field){
    if (newItem.getField(field)){
      item.setField(field,newItem.getField(field))
    }
  }
  item.setCreators(newItem.getCreators());

  // Parcourez la liste de champs et mettez à jour chacun d'eux
  let fields=["title","publicationTitle","journalAbbreviation","volume",  "issue","date","pages","issue","ISSN","url","abstractNote"  ]
  for (let field of fields){
    update(field);
  }

  // Supprimez l'élément temporaire créé par la recherche en ligne
  newItem.deleted = true;
  // Enregistrez les modifications de l'élément de Zotero
  item.saveTx();
  // Enregistrez les modifications de l'élément temporaire
  await newItem.saveTx();
}

return ("Les éléments sélectionnés ont été mis à jour avec succès !");