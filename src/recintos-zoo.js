//Laura Ferre Scotelari - Desafio Start DB

import { Animal } from "./animal.js";
import { readFileSync } from 'fs'; 
import { Enclosure } from "./enclosure.js";

//Classe recintos Zoo
class RecintosZoo {

    //funcao responsavel por ler arquivos do tipo JSON
    readData(dataFileName){
        try {
            const data = readFileSync(dataFileName, 'utf-8');  
            const json = JSON.parse(data); 
            return json;  
        } catch (err) {
            return { erro: "Erro na leitura do arquivo:", recintosViaveis: null };
        }
    }

    //funcao respondavel por extrair as informações relevantes de uma frase
    tokenizeSentence(sentence){
        const tokens = sentence.split(' ');
        const tokensList = [];

        for(let i = 0; i < tokens.length; i++){
            if(tokens[i] !== 'e' && tokens[i] !== 'ou' && tokens[i] !== ','){
                tokensList.push(tokens[i]);
            }
        }
        return tokensList;
    }

    //Funcao responsavel pelo tratamento dos nomes de animais
    animalNameHandling(originalName){
        //tratamento do nome dos animais, deixando em caixa alta e retirando acentos
        let animalName = (originalName.toUpperCase()).normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        if(animalName[originalName.length - 1] === 'S'){
            //removendo a ultima letra da palavra
            animalName = animalName.slice(0, -1);
        }
        return animalName;
    }

    //Funcao responsavel por ler os recintos disponiveis, extrair informacoes relevantes e 
    //agrupar objetos do tipo Enclosure em uma lista a fim de facilitar a manipulacao
    readEnclosure(validAnimals){
        //lendo a lista com as informações atuais de recintos e separando os biomas 
        const enclosureList = this.readData('./src/enclosure.json');
        const validEnclosures = [];
        for(let i = 0; i < enclosureList.length; i++){
            enclosureList[i].biome = this.tokenizeSentence(enclosureList[i].biome);
            const tokensOccupation = this.tokenizeSentence(enclosureList[i].currAnimal);
            let occupiedArea = 0;
            let currAnimal = "VAZIO";

            //calculando a area ocupada para o caso do recinto nao estar vazio
            if(tokensOccupation[0] !== "vazio"){
                currAnimal = this.animalNameHandling(tokensOccupation[1]);
                //calculando a area ocupada com os animais que ja estao la
                occupiedArea = parseInt(tokensOccupation[0]) * validAnimals[currAnimal].size;
            }
            const enclosure = new Enclosure(enclosureList[i].number, enclosureList[i].biome, enclosureList[i].totalSize, occupiedArea, currAnimal);
            validEnclosures.push(enclosure);
        }

        return validEnclosures;
    }

    //funcao responsavel por filtrar os recintos de acordo com as necessidades do novo animal
    filterEnclosures(newAnimal, enclosuresList, area, quantidade, carnivoresList){
        
        if(newAnimal.species === "MACACO" || newAnimal.species === "GAZELA"){
            //animais que podem dividir recintos sem grandes restricoes
            return enclosuresList.filter(el =>
                el.biome.some(element => newAnimal.biome.includes(element)) &&
                ((newAnimal.species === "MACACO" && (el.currAnimal !== "VAZIO" || quantidade > 1)) || newAnimal.species === "GAZELA") &&
                !carnivoresList.includes(el.currAnimal) &&
                ((newAnimal.species === el.currAnimal && el.occupiedArea + area <= el.totalSize)
                ||(newAnimal.species !== el.currAnimal && el.occupiedArea + area + 1 <= el.totalSize))
            );
            
        }else if(carnivoresList.includes(newAnimal.species)){
            //animais carnivoros devem habitar apenas recintos com animais da mesma especie
            return enclosuresList.filter(el =>
                el.biome.some(element => newAnimal.biome.includes(element)) &&
                el.occupiedArea + area <= el.totalSize &&
                (el.currAnimal === newAnimal.species || el.currAnimal === "VAZIO")
            );
        }else if(newAnimal.species === "HIPOPOTAMO"){
            //animal que considera o bioma para dividir o recinto
            return enclosuresList.filter(el =>
                el.biome.some(element => newAnimal.biome.includes(element))&&
                !carnivoresList.includes(el.currAnimal) &&
                (((el.currAnimal === newAnimal.species || el.currAnimal === "VAZIO") && el.occupiedArea + area <= el.totalSize)
                ||(newAnimal.species !== el.currAnimal && el.occupiedArea + area + 1 <= el.totalSize && (el.biome.includes('savana') && el.biome.includes('rio'))))
            );
        }
    }

    analisaRecintos(animal, quantidade) {
        //verificando se a quantidade e valida
        if(quantidade > 0){
            //lista com os animais validos 
            const animalList = this.readData('./src/animals.json');

            const newAnimalSpecies = animal.toUpperCase();

            //transformando a lista de animais em um dicionário, para facilitar a manipulação
            const validAnimals = animalList.reduce((acc, animal) => {
                acc[animal.species] = { size: animal.size, biome: animal.biome };
                return acc;
            }, {});
            
            //verificando se o animal e valido
            if(validAnimals[newAnimalSpecies] != null){
                const biomes = this.tokenizeSentence(validAnimals[newAnimalSpecies].biome);
                const newAnimal = new Animal(animal, validAnimals[newAnimalSpecies].size, biomes);
                
                //lendo a lista de recintos disponiveis e retornando uma lista de objetos do tipo Enclosure
                const validEnclosures = this.readEnclosure(validAnimals);

                //area ocupada pelos novos animais
                const area = newAnimal.size * quantidade;
                const carnivoresList = ["LEAO", "LEOPARDO", "CROCODILO"];

                //filtrando a lista de recintos de acordo com as restricoes do novo animal
                const filteredEnclosures = this.filterEnclosures(newAnimal, validEnclosures, area, quantidade, carnivoresList);
                
                if(filteredEnclosures.length < 1){
                    return { erro: "Não há recinto viável", recintosViaveis: null };
                }else{
                    //reunindo em uma lista as strings referentes aos recintos possiveis 
                    const recintosViaveis = filteredEnclosures.map(el => {
                        const viableArea = (newAnimal.species !== el.currAnimal && el.currAnimal !== "VAZIO") ? area + 1 : area;
                        return el.printEnclosure(viableArea);
                    });
                    return { erro: null, recintosViaveis: recintosViaveis };
                }          
            }else{
                return { erro: "Animal inválido", recintosViaveis: null };
            }
        }else{
            return { erro: "Quantidade inválida", recintosViaveis: null };
        }
    }
}

export { RecintosZoo as RecintosZoo };
