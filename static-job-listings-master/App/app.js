
let job = document.getElementsByClassName('job')[0];
let allNode = document.getElementsByClassName('all')[0];
let clonedJobNode = job.cloneNode(1);



window.onload = function() {
    //method 1
    // fetch("./data.json")
    // .then(res => {
    //     return res.json();
    // })
    // .then(r => {
    //     console.log(r)
    // });
    //method 2
    // let data = new Promise((resolve,reject) => {
    //     let data = fetch("./data.json");
    //     resolve(data);
    // }).then(response => {
    //     return response.json();
    // }).then(result => {
    //     console.log(result);
    // })

    // method 3 (Most Preferred)

    async function getData() {
        let pureData = await fetch("./data.json");
        let jsonData = await pureData.json();
        return jsonData;
    }

    function setElements(jobData,myNode) {
        let cimg = [...myNode.getElementsByClassName('cimg')];
        cimg.forEach(elem => elem.src = jobData.logo);
        let cname = myNode.getElementsByClassName('cname')[0];
        cname.innerText = jobData.company;
        let cpos = myNode.getElementsByClassName('cpos')[0];
        cpos.innerText = jobData.position;
        let addInfo = [jobData.postedAt,jobData.contract,jobData.location];
        let cinfo = [...myNode.getElementsByClassName('cinfo')];
        for(let j in cinfo) cinfo[j].innerText = addInfo[j];
        let newTag = myNode.getElementsByClassName('new')[0];
        let featuredTag = myNode.getElementsByClassName('featured')[0];
        if(jobData.new === false) newTag.style.display = "none";
        if(jobData.featured === false) featuredTag.style.display = "none";
    }

    function setSkills(jobData,myNode) {
        let skills = myNode.getElementsByClassName('mySkills')[0];
        let pElem = [...skills.getElementsByTagName('p')];
        pElem[0].innerText = jobData.role;
        pElem[1].innerText = jobData.level;
        let skillSet = jobData.languages.concat(jobData.tools)
        for (let val of skillSet) {
            let pNode = document.createElement('p');
            pNode.innerText = val;
            skills.appendChild(pNode);
        }
    }

    async function fillData() {
        let usersData = await getData();
        for(let jobData of usersData) {
            let allNode = document.getElementsByClassName('all')[0];
            let job = document.getElementsByClassName('job')[0];
            let clonedJobNode = job.cloneNode(1);
            clonedJobNode.style.display = "flex";
            setElements(jobData,clonedJobNode);
            setSkills(jobData,clonedJobNode);
            allNode.appendChild(clonedJobNode);

        }
    }
    fillData();
}