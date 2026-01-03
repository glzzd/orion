const Employee = require("../models/Employee");

const getAllEmployees = async (tenantId, { page = 1, limit = 10, search, sortKey, sortDir, roles, orgUnits, statuses, genders }) => {
  const skip = (page - 1) * limit;
  const query = {};

  if (tenantId) {
    query.tenantId = tenantId;
  }

  if (roles && roles.length > 0) {
    query["jobData.primaryAssignment.role"] = { $in: roles };
  }

  if (orgUnits && orgUnits.length > 0) {
    query["jobData.primaryAssignment.organizationUnitId"] = { $in: orgUnits };
  }

  if (statuses && statuses.length > 0) {
    query["status"] = { $in: statuses };
  }

  if (genders && genders.length > 0) {
    query["personalData.gender"] = { $in: genders };
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
