const { readData, writeData } = require("../data");

const getPersons = (req, res) => {
    const data = readData();
    res.json(data);
};

const getPersonByName = (req, res) => {
    const { nom } = req.params;
    const data = readData();

    const person = data.find(p => p.nom === nom);

    if (person) {
        res.json(person);
    } else {
        res.status(404).json({ message: "Personne non trouvée" });
    }
};


const addPerson = (req, res) => {
    const newPerson = req.body;
    const data = readData();

    data.push(newPerson);
    writeData(data);

    res.status(201).json(newPerson);
};


const getPossessions = (req, res) => {
    const data = readData();
    const possessions = data.flatMap(person => person.possessions);
    res.json(possessions);
};


const addPossession = (req, res) => {
    const { nom, libelle, valeur, dateDebut, tauxAmortissement } = req.body;
    const data = readData();

    const person = data.find(p => p.nom === nom);
    if (person) {
        const newPossession = {
            libelle,
            valeur,
            dateDebut,
            tauxAmortissement,
            dateFin: null
        };
        person.possessions.push(newPossession);
        writeData(data);
        res.status(201).json(newPossession);
    } else {
        res.status(404).json({ message: "Personne non trouvée" });
    }
};


const updatePossession = (req, res) => {
    const { nom, libelle, dateFin } = req.body;
    const data = readData();

    let updated = false;
    data.forEach(person => {
        if (person.nom === nom) {
            person.possessions.forEach(possession => {
                if (possession.libelle === libelle) {
                    possession.dateFin = dateFin;
                    updated = true;
                }
            });
        }
    });

    if (updated) {
        writeData(data);
        res.json({ message: "Possession mise à jour avec succès" });
    } else {
        res.status(404).json({ message: "Personne ou possession non trouvée" });
    }
};


const updatePerson = async (req, res) => {
    try {
        const { nom } = req.params;
        const updatedPerson = req.body;
        const data = await readData();

        let personIndex = data.findIndex(p => p.nom === nom);

        if (personIndex !== -1) {
            data[personIndex] = { ...data[personIndex], ...updatedPerson };
            writeData(data);
            res.json({ message: "Personne mise à jour avec succès", person: data[personIndex] });
        } else {
            res.status(404).json({ message: "Personne non trouvée" });
        }
    } catch (error) {
        console.error("Erreur lors de la mise à jour :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

const closePossession = (req, res) => {
    const { nom, libelle } = req.body;
    const data = readData();

    const person = data.find(p => p.nom === nom);
    if (person) {
        const possession = person.possessions.find(p => p.libelle === libelle);
        if (possession) {
            possession.dateFin = new Date().toISOString().split('T')[0];
            writeData(data);
            res.json({ message: "Possession clôturée avec succès" });
        } else {
            res.status(404).json({ message: "Possession non trouvée" });
        }
    } else {
        res.status(404).json({ message: "Personne non trouvée" });
    }
};

const getPatrimoineByDate = (req, res) => {
    const { date } = req.params;
    const data = readData();

    let patrimoine = 0;

    data.forEach(person => {
        person.possessions.forEach(possession => {
            if (new Date(possession.dateDebut) <= new Date(date) &&
                (!possession.dateFin || new Date(possession.dateFin) >= new Date(date))) {
                patrimoine += possession.valeurConstante || possession.valeur;
            }
        });
    });

    res.json({ date, patrimoine });
};

const getPatrimoineByDateRange = (req, res) => {
    const { dateDebut, dateFin, jour, type } = req.query;
    const data = readData();

    let patrimoine = 0;

    data.forEach(person => {
        person.possessions.forEach(possession => {
            const possessionDateDebut = new Date(possession.dateDebut);
            const possessionDateFin = possession.dateFin ? new Date(possession.dateFin) : null;

            if ((type ? possession.type === type : true) &&
                possessionDateDebut <= new Date(dateFin) &&
                (!possessionDateFin || possessionDateFin >= new Date(dateDebut))) {

                patrimoine += possession.valeurConstante || possession.valeur;
            }
        });
    });

    res.json({ dateDebut, dateFin, patrimoine });
};

const deletePerson = (req, res) => {
    const { nom } = req.params;
    let data = readData();

    const updatedData = data.filter(person => person.nom.trim() !== nom.trim());

    if (data.length === updatedData.length) {
        return res.status(404).json({ message: "Personne non trouvée" });
    }

    writeData(updatedData);
    res.status(200).json({ message: "Personne supprimée avec succès" });
};


module.exports = {
    getPersons,
    addPerson,
    getPossessions,
    addPossession,
    updatePossession,
    closePossession,
    getPatrimoineByDate,
    getPatrimoineByDateRange,
    deletePerson,
    updatePerson,
    getPersonByName
};
