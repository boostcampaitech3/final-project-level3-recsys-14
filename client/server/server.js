const express = require('express');
const app = express(); // express 실행한 것을 받음
const port = 8080;

const cors = require('cors');
app.use(cors());

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});

const UserList = [
    {
        id: 1,
        user: 'juk1329'
    },
    {
        id: 2,
        user: 'wh4044'
    },
    {
        id: 3,
        user: 'glanceyes'
    }
]
const Prob =[
    {
        id: 1,
        probId: '1000',
        tag : ['수학','정수론','소수 판정', '에라토스테네스의 체'],
        flag : false
    },
    {
        id: 2,
        probId: '1001',
        tag : ['수학','정수론','소수 판정', '에라토스테네스의 체'],

        flag : false
    },
    {
        id: 3,
        probId: '1002',
        tag : ['수학','정수론','소수 판정', '에라토스테네스의 체'],

        flag : false
    },
    {
        id: 4,
        probId: '1003',
        tag : ['수학','정수론','소수 판정', '에라토스테네스의 체'],

        flag : false
    },
    {
        id: 5,
        probId: '1004',
        tag : ['수학','정수론','소수 판정', '에라토스테네스의 체'],

        flag : false
    },
    {
        id: 6,
        probId: '1005',
        tag : ['수학','정수론','소수 판정', '에라토스테네스의 체'],

        flag : false
    },
    {
        id: 7,
        probId: '1006',
        tag : ['수학','정수론','소수 판정', '에라토스테네스의 체'],

        flag : false
    },
    {
        id: 8,
        probId: '1007',
        tag : ['수학','정수론','소수 판정', '에라토스테네스의 체'],

        flag : false
    },
]

app.post('/user', async(req,res)=>{
    const body = req.body;
    if(body.id == "a"){
        loginUser.push(body.id)
        res.send(true);
    }
    else{
        res.send(false);
    }
})

app.post('/user/search', async(req,res)=>{
    const body = req.body;
    console.log(body.userId);
    console.log(UserList.findIndex(i => i.user == body.userId));
    if(UserList.findIndex(i => i.user == body.userId) !== -1){
        const data = UserList[UserList.findIndex(i => i.user == body.userId)];
        data.flag = true;
        res.send(data)
    }else{
        const data = {id : -1, user: '', flag : false}
        res.send(data)
    }
})
app.get('/problem/individual', async(req,res)=>{
    // const prob = Prob;
    res.send(Prob)
})