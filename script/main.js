//Classe para recuperar os valores das var dos elementos id e atribuir a uma instância do objeto dinâmicamente
class Expenses {
    constructor(year, month, day, type, description, value){

        this.year = year
        this.month = month
        this.day = day
        this.type = type
        this.description = description
        this.value = value
    }

    validateData(){ //Metodo forIn vai recuperar os dados de um determinado atributo e colocado dentro de uma variavel
        for( let i in this){ // vai percorrer os metodos da função registerExpenses, recuperando os atributos do obj expenses


            //Verifica se o dia digitado no input e válido, se não for retorna o modal de erro
            if(this.day > 31 || this.day == 0){
                let invalidDay = document.getElementById('dia')
                invalidDay.style.border = '1px solid red'
                return false

            }

            //Verificação para ver se os valore percorridos são inválidos ou não
            if( this[i] == undefined || this[i] == '' || this[i] == null){// o this[] essa notação permite acessar a partir do this do atributo os valores
                return false
            }
        }
        return true // Se todos os dados percorridos estiverem com valores retorna true, e a instância da classe vai
        //receber uma verificação com a instância expenses.validateData() salvando o obj no localStorage
    }
}

// Classe para identificar e gravar no localStorage os dados
class Bd {
    constructor(){
        let id = localStorage.getItem('id')

        // Lógica para que se o id for nulo retornar 0
        if(id === null){
            localStorage.setItem('id', 0)
        }
    }

    //Metodo para verificar se já tem um objeto salvo no localStorage
    getNextID(){
        let nextID = localStorage.getItem('id') // getItem() serve para recuperar um dado do localStorage
        return Number(nextID) + 1
    }

    //Uma metodo para acessar o LocalStorage 
    saveInformation( save ){

    // Retorna um objeto de manipulação do browser.
    
    let id = this.getNextID()

    localStorage.setItem(id, JSON.stringify(save)) // Metodo 'setItem' permite passar o objeto que deseja armazernar 
    //e o dado como parametros. O objeto precisa ser convertido no formato JSON. O setItem contem um protocolo que comunica com o localStorage
    localStorage.setItem('id', id)
    }

    recoverRecords(){
        let expensesArray = Array()

        let id = localStorage.getItem('id') // Acessando os id's no localStorage
        
        for(let i = 1 ; i <= id; i++){ // Recupera todos os id's em formato JSON
            let expenses = JSON.parse(localStorage.getItem(i)) // converte para obj para ser manipulado e atribui a uma variavel
            
            // lógica para não incluir indices que foram excluidos

            if( expenses === null){
                continue
            }

            //Criamos o atributo id recebendo o valor do id de cada registro para que possamos usar na consulta de despesas
            expenses.id = i
            expensesArray.push(expenses) // Pegar os valores recuperados e atribuir a um array
        }
        return expensesArray
    }

    //Metodo para pesquisar os registros dentro do localStorage de acordo com os filtros que estão definidos no obj
    search(expenses){
        //Atribui um array que vai receber o metodo que tem os objetos gravados no localStorage a uma variavel
        let filterExpenses = Array()

         //Usando o metodo que recupera o obj do localStorage, para reaproveitar o codigo, passando o metodo como atributo do metodo search
         //com isso o array vai receber os dados do metodo recoverRecords
        filterExpenses = this.recoverRecords()
        console.log(filterExpenses);
        console.log(expenses)

        //filtros de ano, mes, dia, tipo, descrição e valor
        //Teste para verificar se o campo foi selecionado

        if(expenses.year != ''){
            console.log('filtro ano')
            //vai verificar se o valor digitado no campo é igual a algum dos valores do atributo year dos obj do localStorage
            filterExpenses = filterExpenses.filter(d => d.year == expenses.year)

        }

        if(expenses.month != ''){
            console.log('filtro mes')
            filterExpenses = filterExpenses.filter(d => d.month == expenses.month)

        }

        if(expenses.day != ''){
            console.log('filtro dia')
            filterExpenses = filterExpenses.filter(d => d.day == expenses.day)

        }

        if(expenses.type != ''){
            console.log('filtro tipo')
            filterExpenses = filterExpenses.filter(d => d.type == expenses.type)

        }

        if(expenses.description != ''){
            console.log('filtro descrição')
            filterExpenses = filterExpenses.filter(d => d.description == expenses.description)

        }

        if(expenses.value != ''){
            console.log('filtro valor')
            filterExpenses = filterExpenses.filter(d => d.value == expenses.value)

        }

        return filterExpenses
    }


    removeRecord(id){
        localStorage.removeItem(id)

    }

}

let bd = new Bd()


//Função para capturar os elementos id e os eventos de clique
function registerExpenses(){

    let year = document.getElementById('ano')
    let month = document.getElementById('mes')
    let day = document.getElementById('dia')
    let type = document.getElementById('tipo')
    let description = document.getElementById('descricao')
    let value = document.getElementById('valor')

    let expenses = new Expenses
    ( //Os valores das variaves como parâmetros do constructor da classe Expenses
        year.value, 
        month.value, 
        day.value, 
        type.value, 
        description.value, 
        value.value
    )

    //Verificar se a classe de despesas tem os dados válidos ou inválidos

    //Usando jQuery retorna o modal válido para o user
    if(expenses.validateData()){
        bd.saveInformation(expenses) // Gravar a mensagem no localStorage

        document.getElementById('modalTitle').innerHTML = 'Dados gravados com sucesso!' // Atribuimos dinamicamente o texto da div atraves do id
        document.getElementById('modalColor').className = 'modal-header text-success'
        document.getElementById('modalContent').innerHTML = 'Despesa cadastrada com sucesso.'
        document.getElementById('modalBtn').innerHTML = 'Voltar'
        document.getElementById('modalBtn').className = 'btn btn-success'

        $('#successRecording').modal('show') // Exibir mensagem


        let validDay = document.getElementById('dia')
        validDay.style.border = '1px solid green'

        year.value = ''
        month.value = ''
        day.value = ''
        type.value = ''
        description.value = ''
        value.value = ''
    }

    // Usando o jQuery para retornar o modal de dados incompletos para o user
    else{

        document.getElementById('modalTitle').innerHTML = 'Erro, dados incompletos!'
        document.getElementById('modalColor').className = 'modal-header text-danger'
        document.getElementById('modalContent').innerHTML = 'Erro no cadastro das despesas, verifique os dados!'
        document.getElementById('modalBtn').innerHTML = 'Tente novamente'
        document.getElementById('modalBtn').className = 'btn btn-danger'

        $('#errorRecording').modal('show') // selecionando a div e exibindo o modal
    }
    
}

//Função para carregar a lista de despesas quando o user clicar na consulta
//filter = false é um parametro que recebe falso, para quando ser verificado no if, esse parametro vai impedir de mostrar os dados do bd
//quando nenhum campo da pesquisa for encontrado.
function uploadExpenseList( expenses = Array(), /*filter = false*/){
    
    //Length indica quantos parametros a função espera. Se nenhum parametro for passado vai carregar todos os registros, array vazio é igual a 0 por default
    if(expenses.length == 0 /* && filter == false */){
        expenses = bd.recoverRecords() // Ao recarregar a pagina chama o metodo da instância bd que recupera os registros, exibindo
        //todos os registros caso a condição seja true
    }

    //Selecionando os elementos da tabela de forma dinâmica para colocar o array de objetos 
    let expensesList = document.getElementById('expensesList')
    expensesList.innerHTML = ''
    
    //Percorrer cada item do array pelo forEach e atribuir a uma função de parametro 'd' que vai
    expenses.forEach(function(d){

        //Metodo para colocar linhas no tbody do html de forma dinâmica
        let line = expensesList.insertRow()

        //Metodo para criar colunas partido da coluna 0 como parametro, usa o innerHtml para inserir o conteúdo interno
        //e de forma dinâmica vai preencher as outras linhas pois estamos percorrendo cada item do array de objetos.
        line.insertCell(0).innerHTML = `${d.day} / ${d.month} / ${d.year}`

        //Ajustar o type para mostar o texto ao invès do ID
        switch(d.type){
            case '1':
                d.type = 'Alimentação'
                break
            case '2':
                d.type = 'Educação'
                break
            case '3':
                d.type = 'Lazer'
                break
            case '4':
                d.type = 'Saúde'
                break
            case '5':
                d.type = 'Transporte'
                break
        }

        //insertCell insere colunas 
        //metodo 'append' faz inclusao de um elemento
        line.insertCell(1).innerHTML = d.type
        line.insertCell(2).innerHTML = d.description
        line.insertCell(3).innerHTML = `${d.value},00 R$`

        //Botão de excluir registros salvos
        let btn = document.createElement("button")
        btn.className = 'btn btn-danger'
        btn.innerHTML = '<i class= "fas fa-times"></i>'
        btn.id = `id_expenses${d.id}` //Associando o id do obj expenses como valor do botão para cada button ter um id
        btn.style.display = 'flex'
        btn.style.justifyContent = 'center'
        btn.style.width= '30px'
        btn.style.height= '30px'
        //Ação do botão que vai remover despesas
        btn.onclick = function(){

            //Removendo a string do id de cada registro para poder comparar com o id do LocalStorage e fazer a remoção
            // Metodo replace remove a string selecionada e retorna o valor passado nesse caso o valor vazio
            let id = this.id.replace('id_expenses', '')
            //Metodo para remover o registro de consulta, metodo criado na class BD, e o id já esta formatado
            bd.removeRecord(id)

            //Vai executar o metodo de recarregar a pagina automaticamente, não mostrando mais os registros.
            window.location.reload()
        }
        line.insertCell(4).append(btn)

        console.log(d)
    })

}

//Função para filtrar e pesquisar registros salvos, tambem vai mostrar separadamente os itens filtrados
function expensesSearch(){
    
    let year = document.getElementById('ano').value
    let month = document.getElementById('mes').value
    let day = document.getElementById('dia').value
    let type = document.getElementById('tipo').value
    let description = document.getElementById('descricao').value
    let value = document.getElementById('valor').value

    //Objeto instânciado com base na classe expenses já criada, espera os mesmo parametros da classe
    let expenses = new Expenses(year, month, day, type, description, value)

    let expense = bd.search(expenses) 
    //Vai zerar o tbody e mostrar separadamente os itens pesquisados, por conta da logica que esta contida no metodo uploadExpendList
    this.uploadExpenseList(expense /*, true */)
}


function print(){
    document.getElementById('btn')
    let content = document.getElementById('expensesTable').innerHTML
    printingScreen = window.open('about:blank')

    printingScreen.document.write(content)
    printingScreen.window.print()
    printingScreen.window.close()

}




//DADOS PARA RECEBIDOS NO INPUT DE DADOS DO INDEX PARA USAR NA 'ANÁLISE'


class Informations {
    constructor(name, monthSalary, salary) {
        this.name = name
        this.monthSalary = monthSalary
        this.salary = salary
    }

    registerInformations() {

        //Atribuindo o obj a um array com posições ou retornar um array vazio ||[]
        let informationsArray = JSON.parse(localStorage.getItem("informationsArray")) || []

        //Verificar atraves do length a quantidade de indices do array se for maior que 0 não salva mais, se for não vai salvar porque so permite cadastrar uma vez.
        if(informationsArray.length > 0){

            document.getElementById('loginTitle').innerHTML = 'Erro, você já preencheu seus dados!'
            document.getElementById('loginColor').className = 'modal-header text-danger'
            document.getElementById('loginContent').innerHTML = 'Não e necessário preencher novamente!'
            document.getElementById('loginBtn').innerHTML = 'Sair'
            document.getElementById('loginBtn').className = 'btn btn-danger'
    
            $('#registerRecording').modal('show') // selecionando a div e exibindo o modal

        }
        else{
            informationsArray.push(this)

            document.getElementById('successTitle').innerHTML = 'Dados cadastrados com sucesso!'
            document.getElementById('successColor').className = 'modal-header text-success'
            document.getElementById('successContent').innerHTML = 'Você já pode analisar seus dados com base nos gastos!'
            document.getElementById('successBtn').innerHTML = 'Sair'
            document.getElementById('successBtn').className = 'btn btn-success'
    
            $('#registerRecordingSuccess').modal('show') // selecionando a div e exibindo o modal
        } 

        localStorage.setItem("informationsArray", JSON.stringify(informationsArray))

        //console.log(informationsArray) 


        // Destructuring Assingnment do obj contido no array para depois extrair do obj o atributo nome

        let [extractObj] = informationsArray
        let obj = extractObj
        //console.log(obj)
                
        let {name} = obj
        let attrName = name
        //console.log(attrName)
        
        let {salary} = obj
        let attrSalary = salary
        //console.log(attrSalary)


    }

    //Metodo para mostrar dados no cards da analise
    showData(){

        let informationsArray = JSON.parse(localStorage.getItem("informationsArray")) || []

        //Var global para recuperar salário mais prático
        window.globalSalary = JSON.parse(localStorage.getItem("informationsArray")) || []


        let nomeAnaliseElement = document.getElementById('nomeAnalise')
        //Verificação para mostrar o nome do cadastro
            if(nomeAnaliseElement)
            {
                if (informationsArray.length > 0)
                    {
                    let { name } = informationsArray[0]; 
                    document.getElementById('nomeAnalise').innerHTML = ` ${name}! <i class="fa fa-heart" aria-hidden="true"></i>`
                    }
                else
                {
                document.getElementById('nomeAnalise').innerHTML = 'Olá, usuário';
                }
            }

        //Verificação para mostrar o valor bruto (salário sem os descontos de despesas)
        let valueSalaryTotal = document.getElementById('valorSalarioTotal')
        
            if(valueSalaryTotal){
                let { salary } = informationsArray[0]

                document.getElementById('valorSalarioTotal').innerHTML = ` R$ ${salary},00`
            }

    }

    //Metodo que recupera os ids salvos no metodo recover da classe bd para poder recuperar os valores das despesas
    getShareDataValue(){
        let ids = bd.recoverRecords('id')
        //console.log(ids)

       window.arrayValue = Array()
       //console.log(arrayValue)
       
       let arrayType = Array()
       //console.log(arrayType)

       //Percorrer cada item do array, extrair o value de cada item, tornar a var global com o 'window'
       //Transformar de string para number com parseFloat, enviar para o array

       ids.forEach(function(d){
            let { value, type } = d;
            let attrValue = parseInt(value);
            let attrType = parseInt(type);
            arrayValue.push(attrValue);
            arrayType.push(attrType);
        });

        // percorrer cada item do array e somar o anterior com o próximo
        window.add = 0
        for(let i = 0; i < arrayValue.length; i++){
            add += arrayValue[i]
        }
        console.log(add)

        document.getElementById('valorDespesaTotal').innerHTML = `R$ ${add},00`

    }

    cardBalance(){
        
        //Recuperando o salário para aplicar lógica
        let { salary } = globalSalary[0]
        //console.log( salary)

        //Saldo
        window.result = (salary - add)
        //console.log(result)

        //Salvar dados do result no LS
        let dados = JSON.parse(localStorage.getItem("dados")) || [];

        // Verifica se o valor já existe no localStorage antes de adicioná-lo
        if (!dados.includes(result)) {
            dados.push(result);
            localStorage.setItem("dados", JSON.stringify(dados));
        }
    
        // Atualiza a exibição do saldo na página
        let saldoAnaliseElement = document.getElementById('saldoAnalise');
        saldoAnaliseElement.innerHTML = `${result},00`;
        saldoAnaliseElement.style.color = (salary >= add) ? 'green' : 'red';

        let dynamicItems = []

        function showRegister(){
            
            //Ver relatórios com os saldos anteriores
            let register = document.getElementById('btn-report')
            register.onclick = function() {

                // Verifica se a div com a lista já existe
                let existingDiv = document.getElementById('list-container')
                if (existingDiv) {

                    // Se a div existir, remove ela
                    document.body.removeChild(existingDiv)
                } else {

                    // Cria uma nova div e define um id para ela
                    let div = document.createElement('div')
                    div.id = 'list-container'
                    div.style.marginLeft = '63%'
                    div.style.backgroundColor = 'white'
                    div.style.width = '270px'
                    div.style.display = 'flex'
                    div.style.justifyContent = 'center'
                    div.style.marginTop = '20px'
                    div.style.borderRadius = '15px'
                    div.style.boxShadow = '2px 2px 20px rgba(0, 0, 0, 0.5)'
                    div.style.position = 'absolute'
                    div.style.top = '508px'
                    div.style.zIndex = '1'

                    let table = document.createElement('table');
                    table.style.width = '100%';
                    table.style.borderCollapse = 'collapse';


                    let tbody = document.createElement('tbody');


                    let limitedRows = dados.slice(0, 5);

                    limitedRows.forEach(function(dado) {
                        let row = document.createElement('tr');
                        let cell = document.createElement('td');
                
                        cell.textContent = dado;
                        cell.style.textAlign = 'center';
                        cell.style.padding = '8px';
                                        
                        if (dado > 0) {
                            cell.style.color = 'green';
                        } else {
                            cell.style.color = 'red';
                        }
                
                        row.appendChild(cell);
                        tbody.appendChild(row);
                        dynamicItems.push(dado);
                    });


                    table.appendChild(tbody);
                    div.appendChild(table);
                    document.body.appendChild(div);
                        
                }
            }
        }
        showRegister()
    }

    //Metodo para filtrar os gastos por tipo e mostrar a porcentagem de gastos
    filterSpendingByType(){

        function sumArray(array) {
            return array.reduce((acc, val) => acc + parseFloat(val), 0);
        }

        let objComplete = bd.recoverRecords('id')
        //console.log(objComplete)

        //Cada tipo receber seu valor especifíco

        let food = Array()

        let education = Array()

        let leisurex = Array()

        let health = Array()

        let transport = Array()

        //Percorrer array, pegar o tipo e o valor e associar cada um a uma variavel
        objComplete.forEach(function( d ){

            let { type, value } = d;
            let attrType = parseInt(type);
            let attrValue = parseInt(value)

            //Metodo 'reduce()' reduz o array a um unio valor
            //Acumulador (acc) - o valor acumulado que será retornado no final.
            //Valor Atual (cur) - o valor do elemento atual que está sendo processado no array.
            //Índice Atual (index) - o índice do elemento atual que está sendo processado no array.
            //Array Original (src) - o array original que está sendo reduzido.

            let add = objComplete.reduce((acc, cur) => acc + parseInt(cur.value), 0)
            let percentage = parseFloat((attrValue / add) * 100).toFixed(2)

             //Cada tipo recebendo seu valor
            switch(attrType){
                case 1:

                    food.push(percentage)
                    break;

                case 2:
                    education.push(percentage)
                    break;

                case 3:
                    leisurex.push(percentage)
                    break;
                
                case 4:
                    health.push(percentage)
                    break;
                
                case 5:
                    transport.push(percentage)
                    break;
                
            }
            
        })
        
        //Somar os indices de cada array para obter a porcentagem total
        let foodSum = sumArray(food);
        let educationSum = sumArray(education);
        let leisurexSum = sumArray(leisurex);
        let healthSum = sumArray(health);
        let transportSum = sumArray(transport);

        document.getElementById('valorPctFood').innerHTML = `${foodSum}%`
        document.getElementById('valorPctEducation').innerHTML = `${educationSum}%`
        document.getElementById('valorPctLeisure').innerHTML = `${leisurexSum}%`
        document.getElementById('valorPctHealth').innerHTML = `${healthSum}%`
        document.getElementById('valorPctTransport').innerHTML = `${transportSum}%`

        console.log('Food:', foodSum);
        console.log('Education:', educationSum);
        console.log('Leisure:', leisurexSum);
        console.log('Health:', healthSum);
        console.log('Transport:', transportSum);


    }

}


function register() {
    let name = document.getElementById('nome').value
    let monthSalary = document.getElementById('salarioMensal').value
    let salary = document.getElementById('salario').value

    let informations = new Informations(name, monthSalary, salary)
    informations.registerInformations()
    informations.showData()

}

window.onload = function() {
    let informations = new Informations()
    informations.showData()
    informations.getShareDataValue()
    informations.cardBalance()
    informations.filterSpendingByType()
}

//Função ocultar/mostrar saldo (salario - despesas)
function eye() {
    let toggleDiv = document.getElementById('toggleDiv')
    let content = document.getElementById('saldoAnalise')
    
    if (content.style.display === 'block') {
        content.style.display = 'none'
        toggleDiv.classList.remove('fa-eye')
        toggleDiv.classList.add('fa-eye-slash')
    } else {
        content.style.display = 'block'
        toggleDiv.classList.remove('fa-eye-slash')
        toggleDiv.classList.add('fa-eye')
    }
}

document.getElementById('saldoAnalise').style.display = 'block'

