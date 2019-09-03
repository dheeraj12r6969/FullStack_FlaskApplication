from Employee import Employee
from EmployeeProfileDAL import EmployeeProfileDAL
from flask import Flask,jsonify,json,redirect,url_for
from flask import request
from flask import render_template
import os

import datetime
import calendar
from calendar import mdays
import xlsxwriter
import schedule
import time
from shutil import copy

from threading import Thread
from ldap3 import Connection,ALL,Server,NTLM,Tls
from flask import session,g

import logging
from logging.handlers import RotatingFileHandler

# forcapslock
import ctypes

from flask_mail import Mail, Message


app = Flask(__name__)
app.secret_key = os.urandom(24)

app.config.update(Debug=True,
                  # Email settings
                  MAIL_SERVER='smtp.gmail.com',
                  MAIL_PORT=465,
                  MAIL_USE_SSL=True,
                  MAIL_USERNAME="noreplywaters@gmail.com",
                  MAIL_PASSWORD="Waters999"
                  )
mail = Mail(app)



# formultipleusers
# with mail.connect() as conn:
#     for user in users:
#         message = '...'
#         subject = "hello, %s" % user.name
#         msg = Message(recipients=[user.email],
#                       body=message,
#                       subject=subject)
#
#         conn.send(msg)
# mail.send(msg)

class EmployeeProfileUI:
    def __init__(self):
        self.new_employee = "Dheeraj"

@app.before_request
def before_request():
    g.user = None
    if 'user' in session:
        g.user = session['user']

@app.route("/index")
@app.route("/", methods=['GET', 'POST'])
def show_login():
    session.clear()
    VK_CAPITAL = 0x14

    if ctypes.windll.user32.GetKeyState(VK_CAPITAL) & 1:
        CapsOn="Caps Lock On"
    else:
        CapsOn = "Caps Lock Off"
    automatedExcelSheet()
    return render_template('loginV4.html', **locals())


# @app.route("/workinpro")
# def workinpro():
#     if 'user' in session:
#         corpid = session['user']
#         EmployeeName = (sb.get_current_employee_Info(corpid))[0][0]
#         app.logger.info('Leave Details page viewed by: %s', corpid)
#         return render_template('workInPro.html', **locals())
#     return render_template('loginV4.html', **locals())

def Admin():
    managers_corpid = []
    for cid in ReadJson()['ManagersList']:
        managers_corpid.append(cid['CorpID'])
    print(managers_corpid)
    for value in managers_corpid:
        if session['user'] == value:
            pass
            return "Yes"
    return "No"


def ReadJson():
    with open("static/json/pi.json",'r', encoding='utf-8-sig') as json_file:
        json_data = json.load(json_file)
        # print(json_data['project details'][1]['projectId'])
    return json_data


#EmployeeSection
@app.route('/add profile form')
def add_profile_form():
    return render_template("Admin.html")


@app.route('/add profile', methods=['POST'])
def add_profile():
    if 'user' in session:
        employee_id = request.form['employeeId']
        employee_name = request.form['employeeName']
        project_id = request.form['ProjectID']
        project_name = request.form['ProjectName']
        corpid = session['user']
        email = request.form['Mail']
        corp_idM = request.form['CorpID']
        department = request.form['Department']
        employeeODCStatus="Assigned"
        sb = EmployeeProfileDAL()
        projectList = []
        for value in ReadJson()['project details']:
            projectList.append(value['projectName'])
        # EmployeeName = (sb.get_current_employee_Info(corpid))
        EmployeeName = corpid
        employee = Employee(employee_id, employee_name, project_id, project_name, corp_idM, email, department, employeeODCStatus)
        sb.add_employee(employee)
        rowReturn = sb.read_employee()
        sb.c.close()
        print("DataBase is closed")
        app.logger.info('%s added by: %s',employee_id, corpid)
        AdminReturn = Admin()
        if AdminReturn == "Yes":
            return render_template("Dashboard.html", rowTable=rowReturn, **locals())
        else:
            return render_template("Dashboard.html", rowTable=rowReturn, EmployeeName=EmployeeName, employee=employee, corpid=corpid,projectList=projectList)
    return redirect(url_for('show_data'))


# for ajax call (serverside validation)
@app.route('/compare', methods=['POST'])
def compare():
    print("inside compare method serverside validation")
    formElement = request.json
    # print(type(formElement))
    # print(request.get_json())
    sb = EmployeeProfileDAL()
    for keyFromDict in formElement:
        key = keyFromDict
    # gettting id from DB
    idFromDB = sb.gettingEmployeeDetailsForRepeatedEntries(formElement)
    # comparing id for duplicate entries
    if idFromDB == 1:
        msg = key + " is already exist in the system.Please try another."
        return jsonify({'error': msg})
    else:
        return jsonify({'success': 'true'})


@app.route('/Update profile/0', methods=['POST'])
def update_profile():
    # Create cursor
    if 'user' in session:
        sb = EmployeeProfileDAL()
        corpid = session['user']
        # EmployeeName = (sb.get_current_employee_Info(corpid))[0][0]
        EmployeeName = corpid
        employee_id = request.form['employeeId']
        employee_name = request.form['employeeName']
        project_id = request.form['prismId']
        project_name = request.form['projectNameUpdate']
        corpIdM = request.form['corpIdUpdate']
        email = request.form['emailIdUpdate']
        employeeODCStatus= 'Assigned'
        department = request.form['DepartmentUpdate']
        projectList = []
        for value in ReadJson()['project details']:
            projectList.append(value['projectName'])
        employee = Employee(employee_id, employee_name, project_id, project_name, corpIdM, email, department, employeeODCStatus)
        sb.update_employee(employee)
        rowReturn = sb.read_employee()
        sb.c.close()
        print("DataBase is closed")
        # return "Values Submitted to database"
        app.logger.info('%s updated profile details', corpid)
        AdminReturn = Admin()
        if AdminReturn == "Yes":
            return render_template("Dashboard.html", rowTable=rowReturn, **locals())
        else:
            return render_template("Dashboard.html", rowTable=rowReturn, EmployeeName=EmployeeName, employee=employee,projectList=projectList)
    return redirect(url_for('show_data'))


# @app.route('/deleteEmployee',methods=['POST'])
# def deleteemp():
#     if 'user' in session:
#         sb=DBConnection();
#         employeeId= request.form['employeeId']
#         sb.delete_employee(employeeId)
#         rowReturn = sb.read_employee();
#         sb.c.close()
#         print("Database is closed")
#         return render_template("Dashboard.html", rowTable=rowReturn)
#     return redirect(url_for('showData'))


@app.route('/employee details')
def list_all_users():
    if 'user' in session:
        sb = EmployeeProfileDAL()
        corpid=session['user']
        # EmployeeName = (sb.get_current_employee_Info(corpid))[0][0]
        EmployeeName = corpid
        row_return = sb.read_employee()
        projectList = []

        for value in ReadJson()['project details']:
            projectList.append(value['projectName'])
        app.logger.info('Employee Details page viewed by : %s', corpid)
        AdminReturn = Admin()
        if AdminReturn == "Yes":
            return render_template("Dashboard.html", rowTable=row_return, **locals())
        else:
            return render_template("Dashboard.html", rowTable=row_return, EmployeeName=EmployeeName,corpid=corpid, projectList=projectList)
    return redirect(url_for('show_login'))


#leaveSection

def gettingInfo(month,year):
    #corpid=session['user']
    numOfDays = calendar.monthrange(year, int(month))
    numOfDaysCfCurrentMonth = numOfDays[1]
    sb = EmployeeProfileDAL()
    employee_list = sb.read_employee()
    employeeStatusListView = []
    HolidayList = []
    HolidayMonth = []
    HolidayDates = []
    listOfDays = list(range(1, numOfDaysCfCurrentMonth+1))
    # get the current month
    # get the month from holiday
    # and compare
    dateArray = dateArrayMethod(year, int(month))
    i=0
    for value in ReadJson()['waters holidays']:
        HolidayList.append(value['date'].split("/"))
        HolidayMonth.append(HolidayList[i][1])
        # filter out the dates of relevent month
        if month in HolidayMonth:
            if HolidayList[i][1] == month:
                HolidayDates.append(int(HolidayList[i][0]))
                # getHolidayDates
        i=i+1

    for employee in employee_list:
        employeeWorkStatus = []
        counterForOn = 0
        # employeeWorkStatus.append(str(employee[7]))
        employeeWorkStatus.append(str(employee[0]))
        employeeWorkStatus.append(str(employee[1]))
        employeeWorkStatus.append(employee[2])
        employeeWorkStatus.append(employee[3])
        employeeWorkStatus.append(employee[4])
        employeeWorkStatus.append(" ")
        employeeWorkStatus.append(" ")
        employeeWorkStatus.append(" ")
        employeeWorkStatus.append(" ")


        for i in range(numOfDaysCfCurrentMonth):
            if dateArray[i][-3:] == 'Sat' or dateArray[i][-3:] == 'Sun' or (i+1 in HolidayDates):
                employeeWorkStatus.append(" ")
            else:
                employeeWorkStatus.append("Present")
                counterForOn += 1

        employee_leave_list = sb.read_leaves_type(employee[6], month, year)
        if employee_leave_list is not None:
            counterForFullDay = 0
            counterForHalfDay = 0
            for leave in employee_leave_list:
                numOfDays = calendar.monthrange(year, int(month))
                numOfDaysCfCurrentMonth = numOfDays[1]
                leave_date = str(leave[0])
                leave_type = leave[1]
                leavedate = leave_date.split('/')
                if leave_type == '1':
                    employeeWorkStatus[int(leavedate[0]) + 8] = 'FullDayLeave'
                    counterForFullDay += 1
                elif leave_type == '2':
                    employeeWorkStatus[int(leavedate[0]) + 8] = 'HalfDayLeave'
                    counterForHalfDay += 1
                elif leave_type == '3':
                    employeeWorkStatus[int(leavedate[0]) + 8] = 'Non-WIPL'
                    # counterForHalfDay += 1

        totalDayOfFullDays = counterForFullDay
        totalDayOfHalfDays = counterForHalfDay
        totalhoursofWork = (counterForOn*8 - (counterForFullDay*8 + counterForHalfDay*4 )) #+ (len(HolidayDates)*8)))
        employeeWorkStatus.append(" ")
        employeeWorkStatus.append(str(totalDayOfFullDays))
        employeeWorkStatus.append(str(totalDayOfHalfDays))
        employeeWorkStatus[7] = str(totalhoursofWork)
        employeeWorkStatus[5] = str(round(21.85 * totalhoursofWork, 1))
        employeeWorkStatus[6] = str(21.85)
        employeeStatusListView.append(employeeWorkStatus)
    return employeeStatusListView


def gettingOtherDeductionsInfo(month, year):
    numOfDays = calendar.monthrange(year, int(month))
    startDate =  "1-" + str(month) +"-" + str(year)
    endDate = str(numOfDays[1]) + "-" + str(month) +"-" + str(year)
    otherDeductions = []
    for value in ReadJson()['OtherDeductions']:
        otherDeductions.append(value['PaymentRecovery'])
        otherDeductions.append(value['Amount'])
        otherDeductions.append(value['PaymentRecoveryTowards'])
        otherDeductions.append(value['LetterToBeIssued'])
        otherDeductions.append(value['ApprovalAttached'])
        otherDeductions.append(value['NameOftheAttachment'])
        otherDeductions.append(value['ApproverName'])
        otherDeductions.append(value['RemarksReason'])
        otherDeductions.append(value['TypeOfDeduction'])
        otherDeductions.append(value['MinimumWorkDays'])


    # print(numOfDays[1])
    numOfDaysCfCurrentMonth = numOfDays[1]
    sb = EmployeeProfileDAL()
    # EmployeeName = (sb.get_current_employee_Info(corpid))[0][0]


    employee_list = sb.read_employee()
    employeeStatusListView = []
    for employee in employee_list:
        employeeWorkStatus = []
        counterForOn = 0
        dateArray = dateArrayMethod(year, int(month))
        for i in range(numOfDaysCfCurrentMonth):
            if dateArray[i][-3:] == 'Sat' or dateArray[i][-3:] == 'Sun':
                test = " "
            else:
                counterForOn += 1

        employee_leave_list = sb.read_leaves_type(employee[6], month, year)
        if employee_leave_list is not None:
            counterForFullDay = 0
            counterForHalfDay = 0
            for leave in employee_leave_list:
                numOfDays = calendar.monthrange(year, int(month))
                numOfDaysCfCurrentMonth = numOfDays[1]
                leave_date = str(leave[0])
                leave_type = leave[1]
                leavedate = leave_date.split('/')
                if leave_type == '1':
                    counterForFullDay += 1  #full day leave
                else:
                    counterForHalfDay += 1 #half day leave
        totalDayOfFullDays = counterForFullDay
        totalDayOfHalfDays = counterForHalfDay
        totalhoursofWork = 0
        totalhoursofWork = (counterForOn * 8 - (counterForFullDay * 8 + counterForHalfDay * 4))
        print("Total work hours = %d" % totalhoursofWork)
        print("OtherDeductions[9]= %d" % int(otherDeductions[9]))
        if(totalhoursofWork < (int(otherDeductions[9]) * 8)):   #if work days is less than 7 days
            print("inside continue")
            continue
        else:
            employeeWorkStatus.append(str(employee[1]))
            employeeWorkStatus.append(otherDeductions[0])
            employeeWorkStatus.append(employee[2])
            employeeWorkStatus.append(otherDeductions[1])
            employeeWorkStatus.append(startDate)
            employeeWorkStatus.append(endDate)
            employeeWorkStatus.append(otherDeductions[2])
            employeeWorkStatus.append(otherDeductions[3])
            employeeWorkStatus.append(otherDeductions[4])
            employeeWorkStatus.append(otherDeductions[5])
            employeeWorkStatus.append(otherDeductions[6])
            employeeWorkStatus.append(otherDeductions[7])
            employeeStatusListView.append(employeeWorkStatus)
    return employeeStatusListView


# all are int in this
def dateArrayMethod(year, month):
    dateArray = []
    dict = {'0': 'Mon', '1': 'Tue', '2': 'Wed', '3': 'Thu', '4': 'Fri', '5': 'Sat', '6': 'Sun'}
    cal = calendar.Calendar()

    for x in cal.itermonthdays2(year, month):
        if x[0] != 0:
            dateArray.append(calendar.month_name[month][:3] + " " + str(x[0]) + " " + dict[str(x[1])])
    return dateArray

@app.route('/currentMonth')
def currentMonthDetails():
    if 'user' in session:
        corpid = session['user']
        v = request.args.get('mon')
        if v is not None:
            v = v.split("-")
            sb = EmployeeProfileDAL()
            EmployeeName = (sb.get_current_employee_Info(corpid))[0][0]
            d = datetime.date.today()
            month = v[1]
            year = v[0]
            dateArray = []
            dateArray = dateArrayMethod(int(year), int(month))
            # getting selected month
            # total days in current month
            employeeStatusListView = []
            employeeStatusListView = gettingInfo(month, int(year))
            AdminReturn = Admin()
            if AdminReturn == "Yes":
                return render_template("LeaveAppPart2.html", **locals())
            else:
                return render_template("LeaveAppPart2.html",dateArray=dateArray,employeeStatusListView=employeeStatusListView, EmployeeName=EmployeeName, corpid=corpid)
        else:
            sb = EmployeeProfileDAL()
            EmployeeName = (sb.get_current_employee_Info(corpid))[0][0]
            d = datetime.date.today()
            month = d.strftime('%m')
            year = d.strftime('%Y')
            dateArray = []
            dateArray = dateArrayMethod(int(year), int(month))
            # getting selected month
            # total days in current month
            employeeStatusListView = []
            employeeStatusListView = gettingInfo(month, int(year))
            AdminReturn = Admin()
            if AdminReturn == "Yes":
                return render_template("LeaveAppPart2.html", **locals())
            else:
                return render_template("LeaveAppPart2.html", dateArray=dateArray,
                                       employeeStatusListView=employeeStatusListView, EmployeeName=EmployeeName,
                                       corpid=corpid)
    return render_template('loginV4.html', **locals())


def automatedExcelSheet():
    d = datetime.date.today()
    d2 = datetime.date.today() + datetime.timedelta(mdays[d.month])
    day = d.strftime('%d')
    month = d.strftime('%m')
    year = d.strftime('%Y')
    monthName = d.strftime("%b")
    nextMonth = d2.strftime("%m")
    numOfDays = calendar.monthrange(int(year), int(month))
    numOfDaysCfCurrentMonth = numOfDays[1]
    if int(nextMonth) > 12:
        nextMonthName = datetime.date(1900, 14-int(nextMonth), 1).strftime('%b')
        year = int(year)+1
    else:
        nextMonthName = datetime.date(1900, int(nextMonth), 1).strftime('%b')

    # Create a workbook and add a worksheet.
    workbook = xlsxwriter.Workbook(year+"_"+month+"_"+day+"_"+"Leave_data.xlsx")
    worksheet = workbook.add_worksheet(name=monthName+"-"+year)
    worksheet1 = workbook.add_worksheet(name=nextMonthName+"-"+year)

    # Some data we want to write to the worksheet.
    employeeStatusListView = gettingInfo(month, int(year))
    length = len(employeeStatusListView)
    dateArray = dateArrayMethod(int(year), int(month))
    MainList = []
    for date in dateArray:
        dateList = []
        dateList.append(date)
    for item in range(length):
        newDataList = []
        newDataList.append(employeeStatusListView[item][2])
        newDataList.append(employeeStatusListView[item][3])
        leavedata = employeeStatusListView[item][8:-2]
        for totalLeaves in leavedata:
            if totalLeaves == "FullDayLeave" or totalLeaves == "HalfDayLeave":
                newDataList.append(totalLeaves[0:8:7])
            elif totalLeaves == "Non-WIPL":
                newDataList.append(totalLeaves)
            # elif totalLeaves in leavedata:

            else:
                newDataList.append(totalLeaves[0])
        MainList.append(newDataList)
    # # Start from the first cell. Rows and columns are zero indexed.
    row = 0
    col = 0
    bold = workbook.add_format({'bold': True})
    worksheet.set_column('A:A', 20)
    worksheet.set_column('A:B', 30)
    worksheet.write(row, col, "Employee Name", bold)
    worksheet.write(row, col+1, "Project", bold)
    # Iterate over the data and write it out row by row.
    for date in dateArray:
        worksheet.write(row, col + 3, date, bold)
        col += 1
    col = 0
    for employeeList in MainList:
        for item in employeeList:
            worksheet.write(row+1, col, item)
            col += 1
        col = 0
        row += 1

    #nextmonthWorksheet
    employeeStatusListView = gettingInfo(nextMonth, int(year))
    length = len(employeeStatusListView)
    leavedata = employeeStatusListView[0][8:-2]
    dateArray = dateArrayMethod(int(year), int(nextMonth))
    MainList = []
    for date in dateArray:
        dateList = []
        dateList.append(date)
    for item in range(length):
        newDataList = []
        newDataList.append(employeeStatusListView[item][2])
        newDataList.append(employeeStatusListView[item][3])
        leavedata = employeeStatusListView[item][8:-2]
        for totalLeaves in leavedata:
            if totalLeaves == "FullDayLeave" or totalLeaves == "HalfDayLeave":
                newDataList.append(totalLeaves[0:8:7])
            else:
                newDataList.append(totalLeaves[0])
        MainList.append(newDataList)
    # Start from the first cell. Rows and columns are zero indexed.
    row = 0
    col = 0
    bold = workbook.add_format({'bold': True})
    worksheet1.set_column('A:A', 20)
    worksheet1.set_column('A:B', 30)
    worksheet1.write(row, col, "Employee Name", bold)
    worksheet1.write(row, col + 1, "Project", bold)
    # Iterate over the data and write it out row by row.
    for date in dateArray:
        worksheet1.write(row, col + 3, date, bold)
        col += 1
    col = 0
    for employeeList in MainList:
        for item in employeeList:
            worksheet1.write(row + 1, col, item)
            col += 1
        col = 0
        row += 1

    workbook.close()
    pathToCopy = "C:\\Users\\conddas\\Desktop\\LeaveApp V1.1.4\\"+year+"_"+month+"_"+day+"_"+"Leave_data.xlsx"
    destinationPath = "C:\\Users\\conddas\\Desktop\\"
    # copy(pathToCopy, destinationPath)

def scheduler():
    while True:
        schedule.run_pending()
        time.sleep(1)

@app.route('/monthlyOtherDeductions')
def monthlyOtherDeductions():
    if 'user' in session:
        corpid = session['user']
        v = request.args.get('mon')
        if v is not None:
            v = v.split("-")
            sb = EmployeeProfileDAL()
            EmployeeName = (sb.get_current_employee_Info(corpid))[0][0]
            d = datetime.date.today()
            month = v[1]
            year = v[0]
            dateArray = []
            dateArray = dateArrayMethod(int(year), int(month))
            # getting selected month
            # total days in current month
            employeeStatusListView = []
            employeeStatusListView = gettingOtherDeductionsInfo(month, int(year))
            AdminReturn = Admin()
            if AdminReturn == "Yes":
                return render_template("OtherDeductions.html", **locals())
            else:
                return render_template("OtherDeductions.html", dateArray=dateArray,
                                       employeeStatusListView=employeeStatusListView, EmployeeName=EmployeeName,
                                       corpid=corpid)
        else:
            sb = EmployeeProfileDAL()
            EmployeeName = (sb.get_current_employee_Info(corpid))[0][0]
            d = datetime.date.today()
            month = d.strftime('%m')
            year = d.strftime('%Y')
            dateArray = []
            dateArray = dateArrayMethod(int(year), int(month))
            # getting selected month
            # total days in current month
            employeeStatusListView = []
            employeeStatusListView = gettingOtherDeductionsInfo(month, int(year))
            AdminReturn = Admin()
            if AdminReturn == "Yes":
                return render_template("OtherDeductions.html", **locals())
            else:
                return render_template("OtherDeductions.html", dateArray=dateArray,
                                       employeeStatusListView=employeeStatusListView, EmployeeName=EmployeeName,
                                       corpid=corpid)
    return render_template('loginV4.html', **locals())


@app.route('/leavedate' ,methods=["POST"])
def leavedate():
    if 'user' in session:
        print("here")
        date = request.form['Date']
        # corpid = session['user']

        employeeid=request.form['EmployeeId']
        empid=employeeid.strip()
        sb=EmployeeProfileDAL()
        sb.submit_leaves(date, empid)
        app.logger.info('Leave applied for %s on %s by: %s',employeeid,date,corpid)
        return redirect(url_for('leavedate'))
    return render_template('loginV4.html', **locals())

@app.route('/personalLeave')
def personalLeave():
    if 'user' in session:
        print("personalLeave")
        corpid = session['user']
        # currentDate =
        sb = EmployeeProfileDAL()
        EmployeeName=(sb.get_current_employee_Info(corpid))[0][0]
        EmployeeName = corpid
        AdminReturn = Admin()
        if AdminReturn == "Yes":
          return render_template('personalCal.html', **locals())
        else:
            return render_template('personalCal.html', EmployeeName=EmployeeName,corpid=corpid)
    return render_template('loginV4.html', **locals())


@app.route('/showPersonalLeave',methods=["POST", "GET"])
def showPersonalLeave():
    sb = EmployeeProfileDAL()
    corp_id_org=request.args.get('corpid')
    # print(" : Inside data : " + corp_id_org)
    if corp_id_org is not None:
        rowsForManagerEmployee = sb.readTotalLeavesForAnEmployee(corp_id_org)
        return jsonify(rowsForManagerEmployee)
    return render_template('loginV4.html', **locals())

@app.route('/getCurrentUser', methods=["GET"])
def getCurrentUser():
    if 'user' in session:
        corpid=session['user']
        return jsonify(corpid)
    return jsonify("false")


@app.route('/applyLeave' ,methods=["POST", "GET"])
def applyLeave():
    if 'user' in session:
        print("applyLeave")
        date = request.form['Date']
        leaveType=request.form['LeaveType']
        corpid=request.form['CorpID']
        # corpid = session['user']
        sb = EmployeeProfileDAL()
        sb.submit_leaves(date, corpid,leaveType)
        EmployeeName = (sb.get_current_employee_Info(corpid))[0][0]
        app.logger.info('Leave applied for %s on %s by: %s', corpid, date, corpid)
        return jsonify(success='true')
    return render_template('loginV4.html', **locals())


@app.route('/send-mail', methods=['POST'])
def send_mail():
    try:
        corpid = session['user']
        sb = EmployeeProfileDAL()

        EmployeeName = (sb.get_current_employee_Info(corpid))[0][0]
        EmployeeEmail = (sb.get_current_employee_Info(corpid))[0][1]

        if len(sb.gettingRespectiveManagerEmail(corpid)) != 0:
            ManagerEmail=sb.gettingRespectiveManagerEmail(corpid)[0][0]
        else:
            ManagerEmail = EmployeeEmail

        date = request.form['Date']
        leaveType=request.form['LeaveType']
        corpID=request.form['CorpID']
        CalKey=request.form['CalKey']

        EmployeeEmailFromManager=(sb.get_current_employee_Info(corpID))[0][1]
        EmployeeNameFromManager=(sb.get_current_employee_Info(corpID)[0][0])

        if CalKey == 'pCal':
            msg = Message("Leave Applied ",
                          sender="noreplywaters@gmail.com",
                          recipients=[EmployeeEmail,ManagerEmail]
                          )
            msg.body = "Hello "+EmployeeName+" have Successfully Applied for Leave on "\
                       +date+" as "+leaveType
            mail.send(msg)
            return jsonify("Mail Sent!!!")
        else:
            msg = Message("Leave Applied ",
                          sender="noreplywaters@gmail.com",
                          recipients=[EmployeeEmailFromManager, EmployeeEmail]
                          )
            msg.body = "Hello " + EmployeeNameFromManager + " have Successfully Applied for Leave on " \
                       + date + " as " + leaveType
            mail.send(msg)
            return jsonify("Mail Sent!!!")
    except Exception as e:
        return str(e)


@app.route('/org')
def CreateOrg():
    if 'user' in session:
        corpid = session['user']
        # corpid = "conddas"
        sb=EmployeeProfileDAL()
        EmployeeName = (sb.get_current_employee_Info(corpid))[0][0]
        return render_template("CreateOrg.html", **locals())
    return render_template('loginV4.html', **locals())


@app.route('/orgDetails',methods=['GET', 'POST'])
def showdataforManagers():
    if 'user' in session:
        corp_id=session['user']
        # corpid = "conddas"
        sb = EmployeeProfileDAL()
        manager_id = (sb.get_current_employee_Info(corp_id))[0][2]
        if request.method == 'GET':
            EmployeeDetails = sb.read_employee_in_dict()
            return jsonify(EmployeeDetails)
        else:
            print("came in post of orgDetails")
            formElement = request.json
            sb = EmployeeProfileDAL()
            # print(formElement[0])
            result=sb.AssiningToManager(manager_id, formElement)
            return jsonify({"result": result})
    return render_template('loginV4.html', **locals())


@app.route('/updateStatus',methods=["GET","POST"])
def updateEmployeeStatus():
    if 'user' in session:
        if request.method=="POST":
            formElement = request.json
            corp_id = session['user']
            sb = EmployeeProfileDAL()
            manager_id = (sb.get_current_employee_Info(corp_id))[0][2]
            status=sb.update_status(formElement)
            return jsonify(status)
    return render_template('loginV4.html', **locals())


@app.route('/viewteam')
def viewTeamfun():
    if 'user' in session:
        corp_id=session['user']
        # corp_id="conddas"
        sb=EmployeeProfileDAL()
        EmployeeName=sb.get_current_employee_Info(corp_id)[0][0]
        # projectName=sb.get_current_employee_Info()[0][]
        print("In view team")
        AdminReturn = Admin()
        if AdminReturn == "Yes":
            return render_template("viewteam.html", **locals())
        else:
            return render_template("LeaveAppPart2.html", EmployeeName=EmployeeName,
                                   corpid=corp_id)
    return render_template('loginV4.html', **locals())


@app.route('/getsetviewdata',methods=['GET', 'POST'])
def getsetDataforteam():
    if 'user' in session:
        print("In getsetData")
        corp_id = session['user']
        obj = EmployeeProfileDAL()
        EmployeeName=obj.get_current_employee_Info(corp_id)[0][0]
        manager_id = (obj.get_current_employee_Info(corp_id))[0][2]
        if request.method == 'GET':
            orglist = obj.gettingAssignedEmployeeToManager(manager_id=manager_id)
            return jsonify(orglist)
    return render_template('loginV4.html', **locals())


@app.route('/dj',methods=["GET"])
def jsondata():
    with open("static/json/pi.json",'r', encoding='utf-8-sig') as json_file:
        json_data = json.load(json_file)
    return jsonify(json_data)

# @app.route('/revertleavedate' ,methods=["POST"])
# def revertleavedate():
#     if 'user' in session:
#         print("here")
#         date = request.form['Date']
#         corpid = session['user']
#
#         employeeid=request.form['EmployeeId']
#         empid=employeeid.strip()
#         sb=EmployeeProfileDAL()
#         EmployeeName = (sb.get_current_employee_Info(corpid))[0][0]
#         sb.cancel_leaves(date, empid)
#         show_data()
#         app.logger.info('Applied leave reverted for: %s on %s by: %s', employeeid, date, corpid)
#         return redirect(url_for('revertleavedate'))
#     return render_template('loginV4.html', **locals())


def authenticationldap3(username,password):
    return_value = 1
    try:
        server = Server('corp.waters.com', get_info=ALL)
        corpId = "corp\\"+username
        corpPass = password
        conn = Connection(server, user=corpId, password=corpPass, authentication=NTLM, auto_bind=True)
        conn.start_tls()
        name = conn.extend.standard.who_am_i()
        return name
    except:
        print("Failed to Login")
        app.logger.error('Login attempt failed')
        return_value = -1
    finally:
        pass
    return return_value


# Ldap
@app.route('/profile', methods=['GET', 'POST'])
def login():
    corpid=request.form['corpId']
    corppass = request.form['corppass']
    sb = EmployeeProfileDAL()
    # EmployeeName = (sb.get_current_employee_Info(corpid))[0][0]
    EmployeeName = corpid
    rowReturn = sb.read_employee()
    loginfailedmsg = "Invalid credentials"
    EmployeeNamefromldap = authenticationldap3(corpid, corppass)
    if EmployeeNamefromldap == "u:CORP\\"+corpid:
        if request.method == 'POST':
            session.pop('user', None)
            if EmployeeNamefromldap:
                session['user'] = request.form['corpId']
                app.logger.info('-------------------------------------------------------------------------------------')
                app.logger.info('Logged in by: %s', corpid)
                admin_return= Admin()
                if admin_return=="Yes":
                    # return render_template("Dashboard.html", rowTable=rowReturn, **locals())
                    return redirect(url_for("viewTeamfun"))
                else:
                    return render_template("Dashboard.html", rowTable=rowReturn, **locals())
    app.logger.error('Failed to login for %s',corpid)
    return render_template("loginV4.html", **locals())


@app.route('/signout', methods=['GET'])
def signout():
    if 'user' not in session:
        app.logger.info('Logged out by user..')
        return redirect(url_for('show_login'))

    app.logger.info('Logged out by user..')
    app.logger.info('-------------------------------------------------------------------------------------')
    session.pop('user', None)
    return redirect(url_for('show_login'))

@app.route('/demo')
def dem():
    if 'user' not in session:
        return render_template("DemoCal.html")
    return redirect(url_for('show_login'))


if __name__ == '__main__':
    # initialize the log handler
    formatter = logging.Formatter(
        "%(asctime)s %(levelname)s - %(message)s")
    logHandler = RotatingFileHandler('Logs\\UserActivity.log', maxBytes=100000, backupCount=100)
    # set the log handler level
    logHandler.setLevel(logging.INFO)
    logHandler.setFormatter(formatter)
    # set the app logger level
    app.logger.setLevel(logging.INFO)

    app.logger.addHandler(logHandler)
    # schedule.every(1).minutes.do(automatedExcelSheet)

    schedule.every().day.at("16:36").do(automatedExcelSheet)
    # t = Thread(target=scheduler)
    # t.start()

    app.run(host='0.0.0.0',port=7070)
    #app.run(debug=True)
    while True:
        schedule.run_pending()
        time.sleep(1)