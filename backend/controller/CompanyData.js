const Company = require("../models/Data");
const { convertToCamelCase, normalizeWebsite } = require("../utilities/helper");

const uploadCompanyData = async (req, res) => {
  try {
    let { data } = req.body;

    if (!Array.isArray(data) || data.length === 0) {
      return res.status(400).json({ message: "Invalid or empty data array" });
    }

    // Convert input data to camelCase format
    const formattedData = data.map(convertToCamelCase);

    const existingWebsites = new Set(
      (await Company.find()).map((item) => normalizeWebsite(item.website))
    );

    const uniqueData = formattedData.filter((item) => {
      const normalizedWebsite = normalizeWebsite(item.website);
      if (!existingWebsites.has(normalizedWebsite)) {
        existingWebsites.add(normalizedWebsite);
        // item.website = normalizedWebsite; // Store normalized website
        return true;
      }
      return false;
    });

    await Company.insertMany(uniqueData);
    res.status(200).json({ message: "CSV data uploaded successfully" });
  } catch (error) {
    console.log("error in upload data APi", error.message);
    res
      .status(500)
      .json({ message: "Error uploading data", error: error.message });
  }
};

const uploadSingle = async (req, res) => {
  try {
    const data = req.body

    const existingWebsites = new Set(
      (await Company.find()).map((item) => normalizeWebsite(item.website))
    );

    if(existingWebsites.has(normalizeWebsite(data.website))){
      return res.status(401).json({error : 'already present in database'})
    }

    const company = new Company(data);
    await company.save();
    res.status(200).json({ error : "Company added successfully!" });
  } catch (error) {
    res.status(500).json({ error : "Error adding company", message: error.message });
  }
}

const getCompanyData = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const {
      country,
      stage,
      industry,
      programTypes,
      states,
      stages,
      searchTerm,
    } = req.query;

    // Create an array for $or conditions
    const orConditions = [];

    // Add conditions to the $or array for each defined filter
    if (country) {
      orConditions.push({
        country: Array.isArray(country) ? { $in: country } : country,
      });
    }

    if (stage) {
      orConditions.push({
        stage: Array.isArray(stage) ? { $in: stage } : stage,
      });
    }

    if (industry) {
      orConditions.push({
        investingFields: { $in: Array.isArray(industry) ? industry : [industry] },
      });
    }

    if (programTypes) {
      orConditions.push({
        programTypes: Array.isArray(programTypes)
          ? { $in: programTypes }
          : programTypes,
      });
    }

    if (states) {
      orConditions.push({
        states: Array.isArray(states) ? { $in: states } : states,
      });
    }

    if (stages) {
      orConditions.push({
        stages: Array.isArray(stages) ? { $in: stages } : stages,
      });
    }


    if (searchTerm) {
      const regex = new RegExp(searchTerm, "i"); // Case-insensitive regex

      orConditions.push({ companyName: regex });
      orConditions.push({ firstName: regex });
      orConditions.push({ lastName: regex });
      orConditions.push({ email: regex });
      orConditions.push({ title: regex });
      orConditions.push({ website: regex });
      orConditions.push({ industry: regex });
      orConditions.push({ investingFields: { $in: [regex] } });
    }

    // Construct the final query
    const filters = orConditions.length > 0 ? { $or: orConditions } : {};

    const skip = (page - 1) * limit;

    const totalCount = await Company.countDocuments(filters);
    const data = await Company.find(filters)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.status(200).json({ data, totalCount });
  } catch (error) {
    console.log("error in fetch data API", error.message);
    res
      .status(500)
      .json({ message: "Error fetching data", error: error.message });
  }
};

module.exports = { uploadCompanyData, getCompanyData, uploadSingle };
