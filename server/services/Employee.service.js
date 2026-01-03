const Employee = require("../models/Employee");

const getAllEmployees = async (tenantId, { page = 1, limit = 10, search, sortKey, sortDir }) => {
  const skip = (page - 1) * limit;
  const query = {};

  if (tenantId) {
    query.tenantId = tenantId;
  }

  if (search) {
    query.$or = [
      { "personalData.firstName": { $regex: search, $options: "i" } },
      { "personalData.lastName": { $regex: search, $options: "i" } },
      { "personalData.fatherName": { $regex: search, $options: "i" } },
      { employeeCode: { $regex: search, $options: "i" } },
    ];
  }

  let sort = {};
  if (sortKey) {
    sort[sortKey] = sortDir === "desc" ? -1 : 1;
  } else {
    sort = { "audit.createdAt": -1 };
  }

  const employees = await Employee.find(query)
    .populate("jobData.primaryAssignment.organizationUnitId", "name")
    .sort(sort)
    .skip(skip)
    .limit(Number(limit));

  const total = await Employee.countDocuments(query);

  return {
    data: employees,
    meta: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getEmployeeById = async (tenantId, id) => {
  const query = { _id: id };
  if (tenantId) {
    query.tenantId = tenantId;
  }
  return await Employee.findOne(query);
};

module.exports = {
  getAllEmployees,
  getEmployeeById,
};
