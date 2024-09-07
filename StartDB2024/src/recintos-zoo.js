//Laura Ferre Scotelari - Desafio Start DB

import { Animal } from "./animal.js";
import { readFile } from 'fs/promises'; 
import { Enclosure } from "./enclosure.js";

//Classe recintos Zoo
class RecintosZoo {
    async readData(dataFileName){
        //lendo arquivo com informacoes relevantes do zoologico
        try {
            const data = await readFile(dataFileName, 'utf-8');  
            const json = JSON.parse(data); 
            return json;  
        } catch (err) {
            console.error("Erro na leitura do arquivo:", err);
        }
    }

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


    async analisaRecintos(animal, quantidade) {

        //verificando se a quantidade e valida
        if(quantidade > 0){
            //lista com os animais validos 
            const animalList = await this.readData('./src/animals.json');

            const newAnimalSpecies = animal.toUpperCase();
            console.log(newAnimalSpecies);

            //transformando a lista de animais em um dicionário, para facilitar a manipulação
            const validAnimals = animalList.reduce((acc, animal) => {
                acc[animal.species] = { size: animal.size, biome: animal.biome };
                return acc;
            }, {});
            
            //verificando se o animal e valido
            if(validAnimals[newAnimalSpecies] != null){
                const biomes = this.tokenizeSentence(validAnimals[newAnimalSpecies].biome);
                const newAnimal = new Animal(animal, validAnimals[newAnimalSpecies].size, biomes);
                console.log(newAnimal.biome);
            
                //area ocupada pelos novos animais
                const area = newAnimal.size * quantidade;

                //lendo a lista com as informações atuais de recintos e separando os biomas 
                const enclosureList = await this.readData('./src/enclosure.json');
                const validEnclosures = [];
                for(let i = 0; i < enclosureList.length; i++){
                    enclosureList[i].biome = this.tokenizeSentence(enclosureList[i].biome);
                    const tokensOccupation = this.tokenizeSentence(enclosureList[i].currAnimal);
                    console.log(tokensOccupation);
                    let occupiedArea = 0;
                    
                    //calculando a area ocupada para o caso do recinto nao estar vazio
                    if(tokensOccupation[0] !== "vazio"){
                        //tratamento do nome dos animais
                        let animalName = (tokensOccupation[1].toUpperCase());
                        if(animalName[animal.length] === 'S'){
                            //removendo a ultima letra da palavra
                            animalName = animalName.slice(0, -1);
                        }
                        console.log(animalName);

                        occupiedArea = parseInt(tokensOccupation[0]) * validAnimals[animalName].size;
                        console.log(occupiedArea);
                    }

                    const enclosure = new Enclosure(enclosureList[i].number, enclosureList[i].biome, enclosureList[i].totalSize, occupiedArea);
                    validEnclosures.push(enclosure);
                }

                //filtrando a lista de recintos de acordo com o bioma
                const filterEnclosures = validEnclosures.filter(function (el) {
                    return el.biome.some(element => newAnimal.biome.includes(element))
                });

                console.log(filterEnclosures);
                
            }else{
                console.error("Animal inválido");
            }
        }else{
            console.error("Quantidade inválida");
        }


    }

}

export { RecintosZoo as RecintosZoo };
