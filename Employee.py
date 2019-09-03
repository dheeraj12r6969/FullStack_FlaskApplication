class Employee:
    def __init__(self, employee_id, employee_name, project_id, project_name, corp_idM, email, department, employeeODCStatus):
        self.employee_id = employee_id
        self.employee_name = employee_name
        self.project_id = project_id
        self.project_name = project_name
        self.corp_idM = corp_idM
        self.email = email
        self.department = department
        self.employeeODCStatus = employeeODCStatus


class LeaveDetails:
    def __init__(self, employee_name, employee_id, LeaveOn, Managername):
        self.employee_name = employee_name
        self.employee_id = employee_id
        self.LeaveOn = LeaveOn
        self.Managername = Managername
