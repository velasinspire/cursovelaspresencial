/**
 * Recebe a lista de espera do site e grava na aba "Lista de espera".
 * Este código deve ser colado no Apps Script vinculado à Planilha Google.
 */
function doPost(e) {
  var lock = LockService.getScriptLock();

  try {
    lock.waitLock(10000);

    var dados = e && e.parameter ? e.parameter : {};
    var nome = String(dados.nome || "").trim();
    var whatsapp = String(dados.whatsapp || "").trim();
    var email = String(dados.email || "").trim();
    var consentimento = String(dados.consentimento || "").trim();

    if (!nome || !whatsapp || consentimento !== "Sim") {
      return resposta_(false, "Dados obrigatórios não informados.");
    }

    var planilha = SpreadsheetApp.getActiveSpreadsheet();
    var nomeAba = "Lista de espera";
    var aba = planilha.getSheetByName(nomeAba) || planilha.insertSheet(nomeAba);

    if (aba.getLastRow() === 0) {
      aba.appendRow([
        "Data e hora",
        "Nome completo",
        "WhatsApp",
        "E-mail",
        "Consentimento",
        "Texto do consentimento",
        "Versão do consentimento",
        "Origem"
      ]);
      aba.setFrozenRows(1);
    }

    aba.appendRow([
      new Date(),
      nome,
      whatsapp,
      email,
      consentimento,
      String(dados.consentimento_texto || "").trim(),
      String(dados.consentimento_versao || "").trim(),
      String(dados.origem || "Site — lista de espera").trim()
    ]);

    return resposta_(true, "Cadastro realizado com sucesso.");
  } catch (erro) {
    console.error(erro);
    return resposta_(false, "Não foi possível registrar o cadastro.");
  } finally {
    lock.releaseLock();
  }
}

function resposta_(sucesso, mensagem) {
  return ContentService
    .createTextOutput(JSON.stringify({ sucesso: sucesso, mensagem: mensagem }))
    .setMimeType(ContentService.MimeType.JSON);
}
