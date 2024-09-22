<script runat="server">
    // Carrega a biblioteca core do Salesforce Marketing Cloud
    Platform.Load("core", "1.1.5");

    // Cria uma instância do WSProxy para fazer chamadas à API
    var api = new Script.Util.WSProxy();

    try {
        // Define as colunas a serem recuperadas da Data Extension
        var cols = [
            "ObjectID", "CustomerKey", "Name", "CategoryID", "IsSendable", "SendableSubscriberField.Name", 
            "CreatedDate", "ModifiedDate"
        ];

        // Define um filtro para buscar Data Extensions com CustomerKey não nulo
        var filter = {
            Property: "CustomerKey",
            SimpleOperator: "isNotNull",
            Value: " "
        };

        // Define opções de recuperação com tamanho de lote
        var opts = {
            BatchSize: 5000
        };

        // Propriedades da requisição
        var props = {
            QueryAllAccounts: false
        };

        var result = [],
            moreData = true,
            reqID = null; // Variável para controlar a requisição em lote
        var lineNumber = 1; // Contador de linhas para a tabela

        // Índice dos campos no topo da página (em inglês)
        var indexHtml = "<h2>Field Index</h2>" +
            "<ul>" +
            "<li><strong>#</strong> - Line Number</li>" +
            "<li><strong>Name</strong> - Name of the DataExtension</li>" +
            "<li><strong>ObjectID</strong> - ID of the DataExtension object</li>" +
            "<li><strong>CustomerKey</strong> - Unique key of the DataExtension</li>" +
            "<li><strong>IsSendable</strong> - Indicates if the DataExtension can be used for sending</li>" +
            "<li><strong>SendableSubscriberField</strong> - Field used for sending</li>" +
            "<li><strong>CategoryID</strong> - ID of the folder where the DataExtension is located</li>" +
            "<li><strong>CreatedDate</strong> - Creation date of the DataExtension</li>" +
            "<li><strong>ModifiedDate</strong> - Last modification date of the DataExtension</li>" +
            "</ul>";

        // Início da construção da tabela HTML
        var html = "<table border='1' cellpadding='5' cellspacing='0'><thead><tr>" +
            "<th>#</th>" +  
            "<th>Name</th>" +
            "<th>ObjectID</th>" +
            "<th>CustomerKey</th>" +
            "<th>IsSendable</th>" +
            "<th>SendableSubscriberField</th>" +
            "<th>CategoryID</th>" +  
            "<th>CreatedDate</th>" +  
            "<th>ModifiedDate</th>" +  
            "</tr></thead><tbody>";

        // Loop para continuar a busca enquanto houver mais dados
        while(moreData) {
            moreData = false; // Reinicializa a variável a cada iteração
            if(reqID) props.ContinueRequest = reqID; // Define a requisição de continuação se existir
            var req = api.retrieve("DataExtension", cols, filter, opts, props); // Recupera as Data Extensions

            if (req && req.Results && req.Results.length > 0) {
                moreData = req.HasMoreRows; // Verifica se há mais linhas para recuperar
                reqID = req.RequestID; // Armazena o ID da requisição

                var results = req.Results; // Armazena os resultados da requisição

                // Itera sobre os resultados retornados
                for (var k in results) {
                    var name = results[k].Name; // Nome da DataExtension
                    var objectId = results[k].ObjectID; // ID do objeto
                    var customerKey = results[k].CustomerKey; // Chave do cliente
                    var isSendable = results[k].IsSendable; // Verifica se é enviável
                    var sendableSubscriberField = results[k].SendableSubscriberField ? results[k].SendableSubscriberField.Name : "N/A"; // Campo de assinante
                    var categoryId = results[k].CategoryID; // ID da categoria
                    var createdDate = results[k].CreatedDate ? results[k].CreatedDate : "N/A"; // Data de criação
                    var modifiedDate = results[k].ModifiedDate ? results[k].ModifiedDate : "N/A"; // Data da última modificação

                    // Adiciona uma linha à tabela HTML com os dados da DataExtension
                    html += "<tr>" +
                        "<td>" + lineNumber + "</td>" + // Número da linha
                        "<td>" + name + "</td>" + // Nome da DataExtension
                        "<td>" + objectId + "</td>" + // ObjectID
                        "<td>" + customerKey + "</td>" + // CustomerKey
                        "<td>" + (isSendable ? "Yes" : "No") + "</td>" + // Indica se é enviável
                        "<td>" + sendableSubscriberField + "</td>" + // Campo de assinante
                        "<td>" + categoryId + "</td>" + // ID da categoria
                        "<td>" + createdDate + "</td>" + // Data de criação
                        "<td>" + modifiedDate + "</td>" + // Data da última modificação
                        "</tr>";

                    lineNumber++; // Incrementa o contador da linha
                }
            }
        }

        // Fecha a tabela
        html += "</tbody></table>";

        // Escreve o índice e a tabela HTML na saída
        Write(indexHtml);
        Write(html);
    } catch (error) {
        // Em caso de erro, escreve a mensagem de erro na saída
        Write(Stringify(error));
    }
</script>