const express = require("express");
const router = express.Router();
const {
    getPersons,
    addPerson,
    getPossessions,
    addPossession,
    updatePossession,
    closePossession,
    getPatrimoineByDate,
    getPatrimoineByDateRange,
    deletePerson,
    getPersonByName,
    updatePerson
} = require("../controllers/personController"); 

router.get("/", getPersons);
router.get("/possession", getPossessions);
router.get("/patrimoine/:date", getPatrimoineByDate);
router.get("/patrimoine/range", getPatrimoineByDateRange);
router.get("/:nom", getPersonByName);
router.post("/", addPerson);
router.post("/possession", addPossession);
router.post("/close", closePossession);
router.put("/:nom", updatePerson);
router.put("/possession", updatePossession);
router.delete("/:nom", deletePerson);

module.exports = router;
