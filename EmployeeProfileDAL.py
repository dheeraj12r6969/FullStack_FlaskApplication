import sqlite3
from sqlite3 import Error
import json
from flask import g
from Employee import Employee


class EmployeeProfileDAL:
    def __init__(self):
        DATABASE = "DBN\LeaveApp.db"  # DB file initialization
        db = getattr(g, '_database', None)
        self.conn_db = sqlite3.connect(DATABASE)  # connection opening  instantiation
        print("open database successfully")
        self.c = self.conn_db.cursor()

    def read_employee(self):
        try:
            print("Displaying an Employee details Table")
            self.c.execute("select EmployeeDetails.ProjectID, EmployeeDetails.EmployeeID, EmployeeMaster.EmployeeName,"
                           "ProjectMaster.ProjectName,ProjectMaster.Department,EmployeeDetails.Mail,EmployeeMaster.CorpID,EmployeeStatus.EmployeeWorkStatus "
                           "from EmployeeDetails inner join EmployeeMaster inner join ProjectMaster inner join EmployeeStatus "
                           "on EmployeeDetails.CorpID=EmployeeMaster.CorpID and EmployeeDetails.ProjectID=ProjectMaster.ProjectID "
                           "and EmployeeStatus.EmployeeID=EmployeeMaster.EmployeeID where EmployeeStatus.EmployeeWorkStatus='Assigned'")
            rows = self.c.fetchall()
            # print("EmpId  EmpName PrismId  ProjectId")
            # for row in rows:
            #     print(row)
            return rows
        except Error as e:
            print(e)

    def read_employee_in_dict(self):
        try:
            self.c.execute("select EmployeeDetails.ProjectID, EmployeeDetails.EmployeeID, EmployeeMaster.EmployeeName,"
                           "ProjectMaster.ProjectName,ProjectMaster.Department,EmployeeDetails.Mail,EmployeeMaster.CorpID "
                           "from EmployeeDetails inner join EmployeeMaster inner join ProjectMaster inner join EmployeeStatus "
                           "on EmployeeDetails.CorpID=EmployeeMaster.CorpID and EmployeeDetails.ProjectID=ProjectMaster.ProjectID "
                           "and EmployeeStatus.EmployeeID=EmployeeMaster.EmployeeID where EmployeeStatus.EmployeeWorkStatus='Assigned'")
            entries=[dict(ProjectID=row[0], EmployeeID=row[1], EmployeeName=row[2], ProjectName= row[3], Department=row[4], Mail=row[5], CorpID=row[6]) for row in self.c.fetchall()]
            # print(entries)
            return entries
        except Error as e:
            print(e)

    def add_employee(self, employee):
        try:
            print("Adding Details to table")
            sql = "insert into EmployeeMaster(CorpID,EmployeeName,EmployeeID) values('{}','{}',{})".format(employee.corp_idM, employee.employee_name, int(employee.employee_id))
            self.c.execute(sql)
            self.c.execute("insert into EmployeeStatus(EmployeeWorkStatus,EmployeeID) values('Assigned',{})".format(employee.employee_id))
            self.c.execute("SELECT MAX(EmployeeDetailsID) FROM EmployeeDetails")
            NextEmployeeDetailsID=self.c.fetchone()[0]+1
            self.c.execute("insert into EmployeeDetails(EmployeeDetailsID,EmployeeID,ProjectID,CorpID,Mail)"
                           "values({},{},{},'{}','{}')".format (NextEmployeeDetailsID,
                                                                int(employee.employee_id),int(employee.project_id),
                                                                employee.corp_idM, employee.email))
            self.conn_db.commit()
        except Error as e:
            print("Error Info", e)


    def get_current_employee_Info(self, corpId):
        try:
            print("Displaying an Employee details Table")
            self.c.execute("Select EmployeeMaster.EmployeeName,EmployeeDetails.Mail,"
                           "EmployeeMaster.EmployeeID,EmployeeDetails.ManagerID "
                           "from EmployeeMaster inner "
                           "join EmployeeDetails "
                           "on EmployeeMaster.CorpID = EmployeeDetails.CorpID "
                           "where EmployeeDetails.CorpID='{}'".format(corpId))
            rows = self.c.fetchall()
            # print("EmpId  EmpName PrismId  ProjectId")
            # for row in rows:
            #     print(row)
            return rows
        except Error as e:
            print(e)

    # def get_current_employee_custominfo(self, corpId):
    #     try:
    #         print("Fetching email")
    #         self.c.execute("Select Employee_Name,EmailId from Employee where CorpId=?", (corpId,))
    #         rows = self.c.fetchall()
    #         print("EmpId  EmpName PrismId  ProjectId")
    #         # for row in rows:
    #         # print(row)
    #         return rows
    #     except Error as e:
    #         print(e)

    def update_employee(self, employee):
        try:
            print("Updating Values into Table")
            self.c.execute('update EmployeeMaster set EmployeeName = "{}" where EmployeeId = {}'.format
                           (employee.employee_name, int(employee.employee_id)))

            self.c.execute('update EmployeeDetails set ProjectID = {} where EmployeeId = {}'.format
                           (int(employee.project_id), int(employee.employee_id)))

            self.c.execute("update EmployeeStatus set EmployeeWorkStatus = '{}'  where EmployeeId = {}".format(employee.employeeODCStatus,int(employee.employee_id)))
            self.conn_db.commit()
            print("Successfully updated employee details")
        except Error as e:
            print(e)

    def update_status(self,employeeId):
        try:
            print("Updating Status into Table")
            self.c.execute("update EmployeeStatus set EmployeeWorkStatus = '{}'  where EmployeeId = {}"
                           .format("Unassigned",int((employeeId)[0])))
            self.conn_db.commit()
            print("Successfully updated employee details")
        except Error as e:
            print(e)

    def readTotalLeavesForAnEmployee(self,corpid):
        try:
            self.c.execute("Select LeaveDetails.LeaveDate, LeaveMaster.LeaveID from "
                           "LeaveDetails inner join LeaveMaster on "
                           "LeaveDetails.LeaveID=LeaveMaster.LeaveID "
                           "where CorpID='{}'".format(corpid))
            rows = self.c.fetchall()
            # for row in rows:
            #     print(row)
            return rows
        except Error as e:
            print(e)

    # for export current month details
    # def read_leaves_corpid(self, corp_id, month, year):
    #     try:
    #         # and LeaveDate LIKE '%/{}/{}'
    #         desired = "/" + str(month) + "/" + str(year)
    #         sql=("Select * from EmployeeLeaveInfo where CorpId=? and LeaveDate LIKE '%"+ desired +"'")
    #         self.c.execute(sql, (corp_id,))
    #         rows = self.c.fetchall()
    #         for row in rows:
    #          print(row)
    #         return rows
    #     except Error as e:
    #         print(e)

    def read_leaves_type(self, corp_id, month, year):
        try:
            # and LeaveDate LIKE '%/{}/{}'
            desired = "/" + str(month) + "/" + str(year)
            sql=("Select LeaveDetails.LeaveDate, LeaveDetails.LeaveID from LeaveDetails "
                 "where CorpID = ? and LeaveDate LIKE '%"+ desired +"'")
            # sql=("Select LeaveDetails.LeaveID from LeaveDetails where CorpId = '{}' and LeaveDate LIKE '%{}'".format(corp_id,desired))
            self.c.execute(sql, (corp_id,))
            rows = self.c.fetchall()
            # for row in rows:
             # print(row)
            return rows
        except Error as e:
            print(e)

    # def read_leaves_report(self, requiredMonth,requiredYear):
    #     try:
    #         # and LeaveDate LIKE '%/{}/{}'
    #         desired="/"+str(requiredMonth)+"/"+str(requiredYear)
    #         print(desired)
    #         self.c.execute("Select * from EmployeeLeaveInfo where LeaveDate LIKE '%"+ desired +"'")
    #         rows = self.c.fetchall()
    #         for row in rows:
    #          print(row)
    #         return rows
    #     except Error as e:
    #         print(e)

    def submit_leaves(self, employeeLeave,corpId,leavetype):
        try:
            print("Feeding to database for leaves")
            self.c.execute("insert into LeaveDetails (CorpID,LeaveDate,LeaveID) "
                           "values ('{}','{}','{}') ".format(corpId, employeeLeave, leavetype, corpId))
            self.conn_db.commit()
            print("Successfully updated employee details")
        except Error as e:
            print(e)

    # def cancel_leaves(self, employeeLeave,employeeId):
    #     try:
    #         print("Deleting from database for leaves")
    #         self.c.execute("delete from EmployeeLeaveInfo where LeaveDate = ? and Employee_Id = ? ", (employeeLeave,employeeId))
    #         self.conn_db.commit()
    #         print("Successfully updated employee details")
    #     except Error as e:
    #         print(e)

    #for server side validation in form filling
    def gettingEmployeeDetailsForRepeatedEntries(self, formElement):
        try:
             print("getting the EmpId from db")
             # print(formElement["EmployeeID"])
             print(formElement.keys())

             for keyFromDict in formElement:
                 key = keyFromDict
                 print(key)
             if key == "EmployeeID":
                 self.c.execute("select {} from EmployeeMaster where EmployeeID = {}".format(key,int(formElement[key])))
             elif(key == "Mail"):
                 self.c.execute("select {} from EmployeeDetails where upper({}) = upper('{}')".format(key, key, formElement[key]))
             else:
                 self.c.execute("select {} from EmployeeMaster where upper({}) = upper('{}')".format(key,key, formElement[key]))
             returnedColoumn = self.c.fetchall()
             ret_value = 0
             if len(returnedColoumn) != 0:
                  # if str(returnedColoumn[0][0]) == formElement[key]:
                ret_value = 1
             return ret_value
        except Error as e:
              print(e)

    def gettingAssignedEmployeeToManager(self, manager_id):
        try:
            self.c.execute("select EmployeeMaster.EmployeeID,EmployeeMaster.EmployeeName,EmployeeDetails.Mail,ProjectMaster.ProjectName, EmployeeMaster.CorpID "
                           "from EmployeeDetails inner join EmployeeMaster inner join ProjectMaster inner join EmployeeStatus "
                           "on EmployeeDetails.EmployeeID = EmployeeMaster.EmployeeID "
                           "and EmployeeDetails.ProjectID = ProjectMaster.ProjectID "
                           "and EmployeeStatus.EmployeeID=EmployeeDetails.EmployeeID "
                           "where ManagerID = {} and EmployeeStatus.EmployeeWorkStatus='Assigned'".format(manager_id))
            entries=[dict(EmployeeID=row[0], EmployeeName=row[1], ProjectName= row[2], Mail=row[3], CorpID=row[4]) for row in self.c.fetchall()]
            self.conn_db.commit()
            return entries
        except Error as e:
            print(e)

    def AssiningToManager(self,manager_id,employee_list):
        try:
            for el in employee_list:
                self.c.execute("update EmployeeDetails set ManagerID = {} where EmployeeDetails.EmployeeID = {}".format(manager_id, int(el)))
            self.conn_db.commit()
            return "AssinedToManager"
        except Error as e:
            print(e)

    def gettingRespectiveManagerEmail(self, corp_id):
        try:
            self.c.execute(" select EmployeeDetails.Mail from EmployeeDetails "
                           "where EmployeeDetails.EmployeeID="
                           "(select EmployeeDetails.ManagerID from EmployeeDetails "
                           "where EmployeeDetails.CorpID='{}')".format(corp_id))
            ManagersMail =self.c.fetchall()
            self.conn_db.commit()
            return ManagersMail
        except Error as e:
            print(e)



    # def compare_employee_name(self, emp_name):
    #     try:
    #          print("getting the EmpId from db")
    #          self.c.execute("Select EmployeeName from EmployeeMaster where EmployeeName = ?", [emp_name])
    #          empname = self.c.fetchall()
    #          ret_value = 0
    #          if len(empname) != 0:
    #             if str(empname[0][0]) == emp_name:
    #                 ret_value = 1
    #          return ret_value
    #     except Error as e:
    #          print(e)
        # return render_template("/LeaveApp.html", **locals())

        # def delete_employee(self,):
    #     try:
    #         print("Deleting an Employee details from a Table")
    #         sql="Delete from Employee where Employee_Id=?"
    #         oneEmp=
    #         self.c.execute(sql,(emp_id))
    #         self.conn_db.commit()
    #         print("record delete successfully")
    #     except Error as e:
    #         print(e)
