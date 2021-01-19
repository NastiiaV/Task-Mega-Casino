var moneyUser=0;

// функція для перевірок на коректність суми грошей
function checkForErrors(startSum,correctSum){

    if(startSum < 0){
        console.log("Money cant be < 0!");
        return false;
    }

    else if (startSum > correctSum){
        console.log("Your sum is too big!");
        return false;
    }
   
    else {return true;}
}

class GameMachine {
    constructor(number) {
        this.number = number;
        
    }

    //геттер getMoney
    getMoney () {
        //console.log("Initial sum in machine",this.number)
        return this.number;
    };

    //метод, щоб забрати з GameMachine гроші
    retrieveMoney (number) {
        this.number -= number;
        console.log("After retrieving money from machine:", this.number);
        return this.number;

    };
    //Покласти гроші
    setMoney = function (number) {
        this.number += number;
        console.log("After setting money in machine:", this.number);
        return this.number;
    };
    //Зіграти
    play(number) {
        console.log("Money in machine before contribution:", this.number);

        this.number += number;
        console.log("Money in machine after contribution:", this.number);
        let randomNumb = 0;
        do {
            randomNumb = Math.floor(Math.random() * 999);
        } while (randomNumb < 100);

        console.log("Random number:", randomNumb);
        let firstDigit = Math.floor(randomNumb / 100);
        let secondDigit = Math.floor(randomNumb / 10) % 10;
        let thirdDigit = Math.floor(Math.floor(randomNumb % 10));

        if (firstDigit != secondDigit && firstDigit != thirdDigit && thirdDigit != secondDigit) {
            moneyUser = 0;
        }
        else if (firstDigit == secondDigit && firstDigit == thirdDigit && thirdDigit == secondDigit) {
            moneyUser += 3 * number;
            this.number -= 3 * number;
        }
        else {
            moneyUser += 2 * number;
            this.number -= 2 * number;
        }

        console.log("Money in machine after game:", this.number);
        return this.number;
    }
}


class Casino {
    
    constructor(name) {
        this.name = name;
    }
    totalSum;
    totalMachCount;

    // вхідний параметр arr - масив автоматів з певного казино
    getMoney(arr) {
        this.totalSum=0;
        for (let i = 0; i < arr.length; i++) {
            this.totalSum += arr[i].getMoney();
        }
        //console.log("Total sum in " + this.name +": " + this.totalSum);
        return this.totalSum;
    }

    getMachineCount(arr) {
        this.totalCount=0;
        for (let i = 0; i < arr.length; i++) {
            this.totalMachCount++;
        }
        console.log("Total machine count in " + this.name + ": " + this.totalMachCount);
        return this.totalMachCount;
    }
}


class User {
    constructor(name, money) {
        this.name = name;
        this.money = money;

        if(checkForErrors(money)){
            console.log(this.name +' with initial amount:  '+ this.money);
            return ;
        }
    }

    //почати гру за якимось GameMachine

    play(money,gameMach){

        if(checkForErrors(money,this.money)){
            console.log("User " + this.name +" set : "+ money + " for game");
            gameMach.play(money);
            this.money-=money;
            console.log("User gain after game:",moneyUser);

            this.money+=moneyUser;
            console.log("Total Users amount after game :",this.money);
            
            return moneyUser;
        }

    }
}


class SuperAdmin extends User{
    createCasino(name, arr){
        let newCasino=new Casino(name);
        arr.push(newCasino);
        return newCasino;
    }

    //arr - казино, в яку додаєм машину
    createGameMachine(money,arr){
        
        if(checkForErrors(money,this.money)){

            this.money-= money;
            
            let newGameMach=new GameMachine(money);
            arr.push(newGameMach);

            //console.log("Sum of Admins money after creating machines: " + this.money);
            return newGameMach;

        }
    }

    
    getMoneyFromCas(casName,number,arrCas){
        let start=number;

        // рахуємо загальну кількість грошей в казино
        var total=casName.getMoney(arrCas);

        console.log("Total sum in casino: ",total);

        if(checkForErrors(start,total)){

            // сортуємо автомати за кількістю грошей
            arrCas.sort((a, b) => b.getMoney() - a.getMoney());

            //console.log("Array of machines in casino:",arrCas);
            //console.log("Count of machines is " + arrCas.length);
            for(let i=0;i<arrCas.length;i++){
                if (arrCas[i].getMoney()<number && number!=0){ 

                    // зменшуємо суму грошей, яку хочемо зняти
                    number-=arrCas[i].getMoney();

                    // зменшуємо суму грошей в машині
                    arrCas[i].retrieveMoney(arrCas[i].getMoney());
                }
                else {
                    arrCas[i].retrieveMoney(number);
                    break;
                }
            }

            // залишок грошей в казино після зняття
            var after= arrCas.reduce(function(sum, current) {
                return sum + current.getMoney();
                }, 0);

            // гроші адміна
            this.money+= start;
            console.log("Sum of Admins money after retrieving: " + this.money);

            console.log("Sum of money in casino after retrieving: " + after);
            
            return start;
        }
    }

    addMoneytoCasino(casName,arr,amount){

        if(checkForErrors(amount,this.money)){
            this.totalSum = casName.getMoney(arr)+amount;
            console.log("Sum of money in casino is "+ this.totalSum);
            //console.log("Sum of money in " + casName.name +" is "+ this.totalSum);

            // Зменшуємо загальну суму грошей адміна
            this.money-=amount;
            console.log("Sum of Admins money after casino refill : " + this.money);

            return this.totalSum;
        }
    }

    addMoneytoMachine(machName,amount){

        if(checkForErrors(amount,this.money)){
            machName.setMoney(amount);

            this.money-=amount;
            console.log("Sum of Admins money after game machine refill : " + this.money);

            return this.number;

        }
    }

    deleteMachine(machName,arr){
        var sumOfMoney=machName.getMoney();
        var parted=sumOfMoney/(arr.length-1);
        console.log("Money of removed machine:",sumOfMoney);
        console.log("Parted money:",parted);
        arr.splice(arr.indexOf(machName),1);
        for(let i=0;i<arr.length;i++){
                
            arr[i].setMoney(parted);
            //console.log("Money in machine " + (i+1) + ": "+ arr[i].getMoney());
        }
        
        return arr;
    }
}

// масив для всіх казино
var casinoArr=[];
//масив для машин певного казино
var arrMachforCas1=[];

var admin= new SuperAdmin("Admin",11000);

var cas1 = admin.createCasino("First Casino",casinoArr);

var mach1=admin.createGameMachine(7000,arrMachforCas1);

var mach2=admin.createGameMachine(2000,arrMachforCas1);
var mach3=admin.createGameMachine(1000,arrMachforCas1);

// console.log("Casino with new game machine", arrMachforCas1);
console.log("-------------------------------");

var user1= new User("User1",90);
user1.play(70,mach2);
console.log("-------------------------------");

admin.play(900,mach1);
console.log("-------------------------------");

var mach4=admin.createGameMachine(900,arrMachforCas1);
// console.log("Casino with new game machine",arrMachforCas1);
console.log("-------------------------------");

admin.getMoneyFromCas(cas1,7500,arrMachforCas1);
console.log("-------------------------------");

console.log("After adding money to casino:")
admin.addMoneytoCasino(cas1,arrMachforCas1,2000);
console.log("-------------------------------");

admin.addMoneytoMachine(mach2,7000);
console.log("-------------------------------");

try {admin.deleteMachine(mach3,arrMachforCas1);}
catch(e) {console.log(e.name + ": "+e.message);}

// console.log("After deleting machines:",arrMachforCas1);