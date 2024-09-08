import { RecintosZoo } from "./src/recintos-zoo.js";

//testando a classe RecintosZoo
const resultado = await new RecintosZoo().analisaRecintos('MACACO', 2);
console.log(resultado.recintosViaveis[0]);