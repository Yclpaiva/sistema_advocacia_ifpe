// server express
import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';


const app = express();
app.use(express.json());
dotenv.config();

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const publicPath = path.join(__dirname, "..", "be", "public");

// Servindo arquivos estáticos
app.use(express.static(publicPath));

app.get("/", (req, res) => {
    res.sendFile(path.join(publicPath, "index.html"));
});

// Tipos para os dados dos usuários, advogados e demandas
interface User {
    id: number;
    email: string;
    password: string;
    userType: 'client' | 'lawyer';
    oab?: string;
    specialty?: string[];
}

interface Demand {
    id: number;
    title: string;
    description: string;
    tags: string[];
    clientId: string;
    lawyerId?: string;
}

let users: User[] = [];
let demands: Demand[] = [];
let lawyers: User[] = [];

app.post('/api/demand', (req: any, res: any) => {
    let dados = req.body;
    let demand: Demand = {
        id: demands.length + 1,
        title: dados.title,
        description: dados.description,
        tags: dados.tags,
        clientId: dados.clientId
    };
    demands.push(demand);
    res.send({ message: 'Demanda criada com sucesso' });
    console.log(demands);
    console.log(demand);
});

app.get('/api/demand', (req: any, res: any) => {
    res.send(demands);
});

app.get('/api/demand/:id', (req: any, res: any) => {
    let id = req.params.id;
    let demand = demands.find(demand => demand.id == id);
    if (demand) {
        res.send(demand);
    } else {
        res.status(404).send({ message: 'Demanda não encontrada' });
    }
});

app.put('/api/demand/:id', (req: any, res: any) => {
    let id = req.params.id;
    let dados = req.body;
    let demand = demands.find(demand => demand.id == id);
    if (demand) {
        demand.title = dados.title;
        demand.description = dados.description;
        demand.tags = dados.tags;
        demand.clientId = dados.clientId;
        demand.lawyerId = dados.lawyerId;
        res.send({ message: 'Demanda atualizada com sucesso' });
    } else {
        res.status(404).send({ message: 'Demanda não encontrada' });
    }
});

app.delete('/api/demand/:id', (req: any, res: any) => {
    let id = req.params.id;
    let index = demands.findIndex(demand => demand.id == id);
    if (index >= 0) {
        demands.splice(index, 1);
        res.send({ message: 'Demanda removida com sucesso' });
    } else {
        res.status(404).send({ message: 'Demanda não encontrada' });
    }
});


// Endpoint para autenticação
app.post('/api/auth/singup', (req: any, res: any) => {
    let dados = req.body;
    if (dados.userType == 'client') {
        let user: User = {
            id: users.length + 1,
            email: dados.email,
            password: dados.password,
            userType: dados.userType
        };
        users.push(user);
        res.send({ message: 'Cliente criado com sucesso' });
    } else if (dados.userType == 'lawyer') {
        let user: User = {
            id: lawyers.length + 1,
            email: dados.email,
            password: dados.password,
            userType: dados.userType,
            oab: dados.oab,
            specialty: dados.specialty
        };
        lawyers.push(user);
        res.send({ message: 'Advogado criado com sucesso' });
        console.log(lawyers);
    }
});

app.post('/api/auth/signin', (req: any, res: any) => {
    let dados = req.body;
    if (dados.userType == 'client') {
        let user = users.find(user => user.email == dados.email && user.password == dados.password);
        if (user) {
            res.send({ message: 'Cliente autenticado com sucesso', id: user.id, userType: user.userType });
        } else {
            res.status(401).send({ message: 'Credenciais inválidas' });
        }
    } else if (dados.userType == 'lawyer') {
        let user = lawyers.find(user => user.email == dados.email && user.password == dados.password);
        if (user) {
            res.send({ message: 'Advogado autenticado com sucesso', id: user.id, userType: user.userType });
        } else {
            res.status(401).send({ message: 'Credenciais inválidas' });
        }
    }
}
);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
