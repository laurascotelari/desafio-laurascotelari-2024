//Laura Ferre Scotelari - Desafio Start DB
//Classe enclosure

class Enclosure{
    constructor(number, biome, totalSize, occupiedArea, currAnimal){
        this.number = number;
        this.biome = biome;
        this.totalSize = totalSize;
        this.occupiedArea = occupiedArea;
        this.currAnimal = currAnimal;
    }

    printEnclosure(newArea){
        const freeArea = this.totalSize - (this.occupiedArea + newArea);
        return "Recinto " + this.number + " (espaço livre: " + freeArea + " total: " + this.totalSize + ")";
    }
}

export {Enclosure as Enclosure}