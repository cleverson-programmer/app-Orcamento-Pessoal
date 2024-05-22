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
        line.insertCell(3).innerHTML = `${d.value} R$`

        //Botão de excluir registros salvos
        let btn = document.createElement("button")
        btn.className = 'btn btn-danger'
        btn.innerHTML = '<i class= "fas fa-times"></i>'
        btn.id = `id_expenses${d.id}` //Associando o id do obj expenses como valor do botão para cada button ter um id
        btn.style.display = 'flex'
        btn.style.justifyContent = 'center'
        btn.style.width = '30px'
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



