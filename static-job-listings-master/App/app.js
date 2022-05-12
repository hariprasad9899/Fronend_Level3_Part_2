
let job = document.getElementsByClassName('job')[0];
let allNode = document.getElementsByClassName('all')[0];
let clonedJobNode = job.cloneNode(1);
const selectedSection = document.getElementsByClassName('selected')[0];
const clear = document.getElementById('clear') 


clear.onclick = function() {
    let allJobs = [...document.getElementsByClassName('openjobs')];
    let tablets = [...document.getElementsByClassName('tablet')]
    for(let eachJob of allJobs) {
        if(!eachJob.classList.contains('spl')) eachJob.style.display = "flex";
    }
    for(let eachTab of tablets) eachTab.remove();
    selectedSection.style.display = "none";
}

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
        myNode.dataset.skills += jobData.role + " ";
        myNode.dataset.skills += jobData.level + " ";
        let skillSet = jobData.languages.concat(jobData.tools)
        for (let val of skillSet) {
            let pNode = document.createElement('p');
            pNode.innerText = val;
            myNode.dataset.skills += val + " ";
            skills.appendChild(pNode);
        }
    }

    async function fillData() {
        let usersData = await getData();
        for(let jobData of usersData) {
            let allNode = document.getElementsByClassName('all')[0];
            let job = document.getElementsByClassName('job')[0];
            let clonedJobNode = job.cloneNode(1);
            clonedJobNode.classList.remove('spl');
            clonedJobNode.style.display = "flex";
            clonedJobNode.dataset.skills = ""
            setElements(jobData,clonedJobNode);
            setSkills(jobData,clonedJobNode);
            allNode.appendChild(clonedJobNode);
        }
        let updatedJobs = document.getElementsByClassName('job');
        return updatedJobs;
    }

   
    function appliedFilters() {
        const values = document.getElementsByClassName('values')[0];
        let tabletElem = [...values.getElementsByClassName('tablet')]
        let filterElems = [];
        for(let each of tabletElem) {
            let pElem = each.getElementsByTagName('p')[0];
            filterElems.push(pElem.textContent)
        }
        return filterElems;
    }

    async function sortData() {
        let allJobs = [...document.getElementsByClassName('openjobs')];
        let filterElem = appliedFilters();
        for(let eachJob of allJobs) {
            if(!eachJob.classList.contains('spl')) {
                let jobSkills =  eachJob.dataset.skills;
                for(let filter of filterElem) {
                    if(!jobSkills.includes(filter)) {
                        eachJob.style.display = "none";
                    }
                }
            }
        }
    }
    
    function reverseSortData() {
        let allJobs = [...document.getElementsByClassName('job')];
        let filterElem = appliedFilters();
        console.log(filterElem.length)
        for(let eachJob of allJobs) {
            if(filterElem.length > 0) {
                if(!eachJob.classList.contains('spl')) {
                    let jobSkills =  eachJob.dataset.skills;
                    for(let filter of filterElem) {
                        if(jobSkills.includes(filter)) {
                            eachJob.style.display = "flex";
                        } else {
                            eachJob.style.display = "none";
                        }
                    }
                }
            } else if(!eachJob.classList.contains('spl')) {
                eachJob.style.display = "flex";
                selectedSection.style.display = "none";
            } 
        }
    }


    function addFilters(val) {
        let addedFilters = appliedFilters();
        console.log(addedFilters,val);
        if(addedFilters.indexOf(val) >= 0) {
            return 
        } else {
        const values = document.getElementsByClassName('values')[0];
        let myDiv = document.createElement('div');
        myDiv.className = "tablet";
        let p1 = document.createElement('p');
        let p2 = document.createElement('p');
        p2.className = "closeSelected"
        p1.innerText = val;
        p2.innerHTML = '&times;'
        myDiv.appendChild(p1);
        myDiv.appendChild(p2);
        values.appendChild(myDiv);
        closebtn();
        sortData();
        }
    }

    async function addData() {
        let updatedJobs = await fillData();
        let myUpdatedJobs = [...updatedJobs];
        for (let eachElem of myUpdatedJobs) {
            let mySkills = eachElem.getElementsByClassName('mySkills')[0];
            let skills = [...mySkills.getElementsByTagName('p')];
            for(let i of skills) {
                i.addEventListener('click', ()=> {
                    selectedSection.style.display = "flex";
                    addFilters(i.innerText)
                })
            }
        }
    }

    
    let closebtn = function() {
        const closeSelected = [...document.getElementsByClassName('closeSelected')];
        closeSelected.forEach(elem => {
            elem.addEventListener('click', () => {
                elem.parentElement.remove();
                reverseSortData();
            })
        })
    }
    closebtn();

    addData();
}