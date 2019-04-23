import React, { Component } from 'react';
import {
    Col,
    Row,
    Card, CardBody, CardHeader, Badge, Table, Button,
    FormGroup,
    Label,
    Input
} from 'reactstrap';
import $ from 'jquery';
import firebase from '../../Config/Firebase/firebase'
import './style.css'
import Cards from 'react-credit-cards';
import NumberFormat from 'react-number-format';
import { updateDeal, getUser } from '../../store/Actions/action'
import { connect } from 'react-redux';
import luhn from 'luhn';
import { Visa, Master, Amex, Discover } from '../NewDeal/Icons';
import SearchInput, { createFilter } from 'react-search-input'

const KEYS_TO_FILTERS = ['ID', 'fullName', 'status.status']


class AllSell extends Component {
    _isMounted = false;
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            modalIndex: 0,
            modal: "none",
            edit: false,
            fullName: ' ',
            phone: ' ',
            phone2: ' ',
            cell: ' ',
            address: ' ',
            city: ' ',
            state: ' ',
            zipCode: ' ',
            email: ' ',
            dob: ' ',
            bankName: ' ',
            bankNumber: ' ',
            nameOnCard: ' ',
            mmn: ' ',
            ssn: ' ',
            cc: ' ',
            cvc: ' ',
            exp: ' ',
            bal: ' ',
            aval: ' ',
            lastPay: ' ',
            lastPayDate: ' ',
            duePay: ' ',
            duePayDate: ' ',
            aprl: ' ',
            cardIndex: 0,
            focused: "cc",
            ccError: "",
            ccBorder: "",
            cardDetail: [],
            addNewCard: false,
            ccBackground: "",
            bankNameBorder: "",
            bankNameBackground: "",
            bankNumberBorder: "",
            bankNumberBackground: "",
            balBorder: "",
            balBackground: "",
            avalBorder: "",
            avalBackground: "",
            lastPayBorder: "",
            lastPayBackground: "",
            lastPayDateBorder: "",
            lastPayDateBackground: "",
            duePayBorder: "",
            duePayBackground: "",
            duePayDateBorder: "",
            duePayDateBackground: "",
            aprlBorder: "",
            aprlBackground: "",
            cardExpire: "",
            cardScheme: "",
            transferCloser: [],
            Notes: " ",
            searchTerm: '',
            transferModal: [],
            transferPassword: "",
            transferError: "",
            transferErrorDisplay: "none",
            transferErrorMessage: "All feilds are required !",
            pointerEvents: "auto",
            oldCardList: [],
            oldSSNList: [],
            oldPhoneList: [],
            phoneError: '',
            phoneBorder: ''
        }
        this.reset = this.reset.bind(this)
        this.searchUpdated = this.searchUpdated.bind(this)

    }
    componentDidMount() {
        var today = new Date();
        var date = today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear();
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                if (user.email === "admin@genesis.com") {

                }
                else {
                    $(window).blur(function () {
                        // console.log('blur')
                        firebase.database().ref('/').child(`AgentAvtivity/${date}/${user.uid}/status`).set("invisible")
                    });
                    $(window).focus(function () {
                        // console.log('focus')
                        firebase.database().ref('/').child(`AgentAvtivity/${date}/${user.uid}/status`).set("online")
                    });
                }

            } else {

            }
        });
    }
    updateDeal() {
        let { fullName, phone, phone2, cell, address, city, state, zipCode, Notes, email, dob, mmn, ssn, cc, bankName, bal, aval, lastPay, lastPayDate, duePay, duePayDate, aprl, nameOnCard, cvc, exp, cardIndex, bankNumber } = this.state;
        // var is_valid = luhn.validate(cc);
        if (cc === " " && this.state.data[this.state.modalIndex].cardDetail === "") {
            let deal = {
                fullName: fullName === " " || fullName === "" ? this.state.data[this.state.modalIndex].fullName : fullName,
                phone: phone === " " || phone === "" ? this.state.data[this.state.modalIndex].phone : phone,
                phone2: phone2 === " " || phone2 === "" ? this.state.data[this.state.modalIndex].phone2 : phone2,
                cell: cell === " " || cell === "" ? this.state.data[this.state.modalIndex].cell : cell,
                address: address === " " || address === "" ? this.state.data[this.state.modalIndex].address : address,
                city: city === " " || city === "" ? this.state.data[this.state.modalIndex].city : city,
                state: state === " " || state === "" ? this.state.data[this.state.modalIndex].state : state,
                zipCode: zipCode === " " || zipCode === "" ? this.state.data[this.state.modalIndex].zipCode : zipCode,
                email: email === " " || email === "" ? this.state.data[this.state.modalIndex].email : email,
                dob: dob === " " || dob === "" ? this.state.data[this.state.modalIndex].dob : dob,
                date: this.state.data[this.state.modalIndex].date,
                time: this.state.data[this.state.modalIndex].time,
                key: this.state.data[this.state.modalIndex].key,
                mmn: mmn === " " || mmn === "" ? this.state.data[this.state.modalIndex].mmn : mmn,
                ssn: ssn === " " || ssn === "" ? this.state.data[this.state.modalIndex].ssn : ssn,
                cardDetail: "",
                card: false,
                ID: this.state.data[this.state.modalIndex].ID,
                uid: this.state.data[this.state.modalIndex].uid,
                Notes: Notes === " " || Notes === "" ? this.state.data[this.state.modalIndex].Notes : Notes,
                CloserNotes: this.state.data[this.state.modalIndex].CloserNotes === undefined ? "" : this.state.data[this.state.modalIndex].CloserNotes,
                status: {
                    status: this.state.oldSSNList.indexOf(ssn) !== - 1 || this.state.oldPhoneList.indexOf(phone) !== -1 ? "Dublicated" : this.state.saleStatus,
                    callbackDate: this.state.data[this.state.modalIndex].status.callbackDate,
                    callbackTime: this.state.data[this.state.modalIndex].status.callbackTime,
                    transferCloserID: this.state.data[this.state.modalIndex].status.transferCloserID,
                    transferCloserName: this.state.data[this.state.modalIndex].status.transferCloserName,
                    transferAgentID: this.state.data[this.state.modalIndex].status.transferAgentID,
                    transferAgentName: this.state.data[this.state.modalIndex].status.transferAgentName,
                    transferDate: this.state.data[this.state.modalIndex].status.transferDate === undefined ? "" : this.state.data[this.state.modalIndex].status.transferDate
                },
                otherDetail: {
                    SecurityWord: this.state.data[this.state.modalIndex].otherDetail.SecurityWord,
                    AnnualIncome: this.state.data[this.state.modalIndex].otherDetail.AnnualIncome,
                    Education: this.state.data[this.state.modalIndex].otherDetail.Education,
                    Designation: this.state.data[this.state.modalIndex].otherDetail.Designation,
                    Company: this.state.data[this.state.modalIndex].otherDetail.Company,
                    HousingStatus: this.state.data[this.state.modalIndex].otherDetail.HousingStatus,
                    EmploymentStatus: this.state.data[this.state.modalIndex].otherDetail.EmploymentStatus,
                    OtherLoan: this.state.data[this.state.modalIndex].otherDetail.OtherLoan,
                    MonthlyMortgages: this.state.data[this.state.modalIndex].otherDetail.MonthlyMortgages,
                    ChequinAccount: this.state.data[this.state.modalIndex].otherDetail.ChequinAccount
                }
            }
            console.log("first")
            this.setState({ edit: false, pointerEvents: "auto", cardDetail: [] })
            this.props.updateDeal(deal)
            this.state.data.splice(this.state.modalIndex, 1, deal)
            this.reset()
        }
        else {
            let cardDetailUpdate = {
                bankName: bankName === " " || bankName === "" ? this.state.data[this.state.modalIndex].cardDetail[cardIndex].bankName : bankName,
                bankNumber: bankNumber === " " || bankNumber === "" ? this.state.data[this.state.modalIndex].cardDetail[cardIndex].bankNumber : bankNumber,
                nameOnCard: nameOnCard === " " || nameOnCard === "" ? this.state.data[this.state.modalIndex].cardDetail[cardIndex].nameOnCard : nameOnCard,
                cc: cc === " " || cc === "" ? this.state.data[this.state.modalIndex].cardDetail[cardIndex].cc : cc,
                cvc: cvc === " " || cvc === "" ? this.state.data[this.state.modalIndex].cardDetail[cardIndex].cvc : cvc,
                exp: exp === " " || exp === "" ? this.state.data[this.state.modalIndex].cardDetail[cardIndex].exp : exp,
                bal: bal === " " || bal === "" ? this.state.data[this.state.modalIndex].cardDetail[cardIndex].bal : bal,
                aval: aval === " " || aval === "" ? this.state.data[this.state.modalIndex].cardDetail[cardIndex].aval : aval,
                lastPay: lastPay === " " || lastPay === "" ? this.state.data[this.state.modalIndex].cardDetail[cardIndex].lastPay : lastPay,
                lastPayDate: lastPayDate === " " || lastPayDate === "" ? this.state.data[this.state.modalIndex].cardDetail[cardIndex].lastPayDate : lastPayDate,
                duePay: duePay === " " || duePay === "" ? this.state.data[this.state.modalIndex].cardDetail[cardIndex].duePay : duePay,
                duePayDate: duePayDate === " " || duePayDate === "" ? this.state.data[this.state.modalIndex].cardDetail[cardIndex].duePayDate : duePayDate,
                aprl: aprl === " " || aprl === "" ? this.state.data[this.state.modalIndex].cardDetail[cardIndex].aprl : aprl,
                card: true,
                cardScheme: this.state.data[this.state.modalIndex].cardDetail[cardIndex].cardScheme
            }
            let { data } = this.state;
            data[this.state.modalIndex].cardDetail[cardIndex] = cardDetailUpdate;
            this.setState({ data })
            let deal = {
                fullName: fullName === " " || fullName === "" ? this.state.data[this.state.modalIndex].fullName : fullName,
                phone: phone === " " || phone === "" ? this.state.data[this.state.modalIndex].phone : phone,
                phone2: phone2 === " " || phone2 === "" ? this.state.data[this.state.modalIndex].phone2 : phone2,
                cell: cell === " " || cell === "" ? this.state.data[this.state.modalIndex].cell : cell,
                address: address === " " || address === "" ? this.state.data[this.state.modalIndex].address : address,
                city: city === " " || city === "" ? this.state.data[this.state.modalIndex].city : city,
                state: state === " " || state === "" ? this.state.data[this.state.modalIndex].state : state,
                zipCode: zipCode === " " || zipCode === "" ? this.state.data[this.state.modalIndex].zipCode : zipCode,
                email: email === " " || email === "" ? this.state.data[this.state.modalIndex].email : email,
                dob: dob === " " || dob === "" ? this.state.data[this.state.modalIndex].dob : dob,
                date: this.state.data[this.state.modalIndex].date,
                time: this.state.data[this.state.modalIndex].time,
                key: this.state.data[this.state.modalIndex].key,
                mmn: mmn === " " || mmn === "" ? this.state.data[this.state.modalIndex].mmn : mmn,
                ssn: ssn === " " || ssn === "" ? this.state.data[this.state.modalIndex].ssn : ssn,
                card: true,
                cardDetail: this.state.data[this.state.modalIndex].cardDetail,
                ID: this.state.data[this.state.modalIndex].ID,
                uid: this.state.data[this.state.modalIndex].uid,
                Notes: Notes === " " || Notes === "" ? this.state.data[this.state.modalIndex].Notes : Notes,
                CloserNotes: this.state.data[this.state.modalIndex].CloserNotes === undefined ? "" : this.state.data[this.state.modalIndex].CloserNotes,
                status: {
                    status: this.state.oldSSNList.indexOf(ssn) !== - 1 || this.state.oldCardList.indexOf(this.state.data[this.state.modalIndex].cardDetail[cardIndex].cc) !== -1 || this.state.oldPhoneList.indexOf(phone) !== -1 ? "Dublicated" : this.state.saleStatus,
                    callbackDate: this.state.data[this.state.modalIndex].status.callbackDate,
                    callbackTime: this.state.data[this.state.modalIndex].status.callbackTime,
                    transferCloserID: this.state.data[this.state.modalIndex].status.transferCloserID,
                    transferCloserName: this.state.data[this.state.modalIndex].status.transferCloserName,
                    transferAgentID: this.state.data[this.state.modalIndex].status.transferAgentID,
                    transferAgentName: this.state.data[this.state.modalIndex].status.transferAgentName,
                    transferDate: this.state.data[this.state.modalIndex].status.transferDate === undefined ? "" : this.state.data[this.state.modalIndex].status.transferDate
                },
                otherDetail: {
                    SecurityWord: this.state.data[this.state.modalIndex].otherDetail.SecurityWord,
                    AnnualIncome: this.state.data[this.state.modalIndex].otherDetail.AnnualIncome,
                    Education: this.state.data[this.state.modalIndex].otherDetail.Education,
                    Designation: this.state.data[this.state.modalIndex].otherDetail.Designation,
                    Company: this.state.data[this.state.modalIndex].otherDetail.Company,
                    HousingStatus: this.state.data[this.state.modalIndex].otherDetail.HousingStatus,
                    EmploymentStatus: this.state.data[this.state.modalIndex].otherDetail.EmploymentStatus,
                    OtherLoan: this.state.data[this.state.modalIndex].otherDetail.OtherLoan,
                    MonthlyMortgages: this.state.data[this.state.modalIndex].otherDetail.MonthlyMortgages,
                    ChequinAccount: this.state.data[this.state.modalIndex].otherDetail.ChequinAccount
                }
            }

            console.log("secound")
            this.setState({ edit: false, pointerEvents: "auto", cardDetail: [] })
            this.props.updateDeal(deal)
            this.state.data.splice(this.state.modalIndex, 1, deal)
            this.reset()
        }

    }
    showModal(i) {
        this.setState({
            modalIndex: i,
            modal: "block",
            pointerEvents: "none"
        })
    }
    async componentWillMount() {
        // var today = new Date();
        // var date = today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear();
        let uid = firebase.auth().currentUser.uid
        this._isMounted = true;
        await firebase.database().ref('/').child(`NewDeals`).on('child_added', (data) => {
            for (var key in data.val()) {
                for (var key1 in data.val()[key]) {
                    if (data.val()[key][key1].cardDetail === "") {

                    }
                    else {
                        for (var i = 0; i < data.val()[key][key1].cardDetail.length; i++) {
                            this.state.oldPhoneList.push(data.val()[key][key1].phone)
                            this.state.oldSSNList.push(data.val()[key][key1].ssn)
                            this.state.oldCardList.push(data.val()[key][key1].cardDetail[i].cc)
                            this.setState({
                                oldCardList: this.state.oldCardList,
                                oldSSNList: this.state.oldSSNList,
                                oldPhoneList: this.state.oldPhoneList
                            })
                        }
                    }
                }
            }
            setTimeout(() => {
                for (var key in data.val()[uid]) {
                    if (this._isMounted) {
                        this.state.transferModal.push({ display: "none" })
                        this.state.data.push(data.val()[uid][key])
                        this.setState({
                            data: this.state.data,
                            transferModal: this.state.transferModal
                        })
                    }
                }
            }, 10)
        })
        let user = firebase.auth().currentUser
        let agent = "Agent"
        this.props.getUser(user, agent)
    }

    saveCard() {
        let { data, bankName, bankNumber, nameOnCard, cc, cvc, exp, cardExpire, bal, aval, lastPay, duePay, aprl, cardScheme } = this.state;
        var is_valid = luhn.validate(cc);
        if (cc === " ") {
            this.setState({
                ccBackground: "#f6e0df",
                ccBorder: "red",
                ccError: "Insert card number ☒",
            })
        }
        else if (is_valid === false) {
            this.setState({
                ccBackground: "#f6e0df",
                ccBorder: "red",
                ccError: "Invalid card number ✗",
            })
        }
        else if (nameOnCard === "") {
            this.setState({
                nameOnCardBackground: "#f6e0df",
                nameOnCardBorder: "red"
            })
        }
        else if (cvc.length < 2) {
            this.setState({
                cvcBackground: "#f6e0df",
                cvcBorder: "red"
            })
        }
        else if (exp === " ") {
            this.setState({
                expBackground: "#f6e0df",
                expBorder: "red"
            })
        }
        else if (cardExpire === true) {
            this.setState({
                expBackground: "#f6e0df",
                expBorder: "red"
            })
        }
        else if (exp.indexOf(" ") !== -1) {
            this.setState({
                expBackground: "#f6e0df",
                expBorder: "red"
            })
        }
        else if (bankName.length < 2) {
            this.setState({
                bankNameBorder: "red",
                bankNameBackground: "#f6e0df"
            })
        }
        else if (bal === " ") {
            this.setState({
                balBorder: "red",
                balBackground: "#f6e0df"
            })
        }
        else if (aval === " ") {
            this.setState({
                avalBorder: "red",
                avalBackground: "#f6e0df"
            })
        }
        else if (lastPay === " ") {
            this.setState({
                lastPayBorder: "red",
                lastPayBackground: "#f6e0df"
            })
        }
        else if (duePay === " ") {
            this.setState({
                duePayBorder: "red",
                duePayBackground: "#f6e0df"
            })
        }
        else if (aprl === " ") {
            this.setState({
                aprlBorder: "red",
                aprlBackground: "#f6e0df"
            })
        }
        else {
            if (this.state.data[this.state.modalIndex].cardDetail === "") {
                let cardDetail = {
                    bankName: bankName,
                    bankNumber: bankNumber,
                    nameOnCard: nameOnCard,
                    cc: cc,
                    cvc: cvc,
                    exp: exp,
                    bal: bal,
                    aval: aval,
                    lastPay: lastPay,
                    duePay: duePay,
                    aprl: aprl,
                    card: true,
                    cardScheme: cardScheme === "" ? "Unknown" : cardScheme
                }
                this.state.cardDetail.push(cardDetail)
                this.setState({
                    cardDetail: this.state.cardDetail,
                    addNewCard: false
                })
                data[this.state.modalIndex].card = true
                data[this.state.modalIndex].cardDetail = this.state.cardDetail
                this.setState({ data })
            }
            else {
                let cardDetail = {
                    bankName: bankName,
                    bankNumber: bankNumber,
                    nameOnCard: nameOnCard,
                    cc: cc,
                    cvc: cvc,
                    exp: exp,
                    bal: bal,
                    aval: aval,
                    lastPay: lastPay,
                    duePay: duePay,
                    aprl: aprl,
                    card: true,
                    cardScheme: cardScheme === "" ? "Unknown" : cardScheme
                }
                this.state.cardDetail.push(cardDetail)
                this.setState({
                    cardDetail: this.state.cardDetail,
                    addNewCard: false,
                })
                data[this.state.modalIndex].card = true
                this.setState({ data })
                if (!this.state.data[this.state.modalIndex].cardDetail) {
                    data[this.state.modalIndex].cardDetail = this.state.cardDetail
                    this.setState({ data })
                }
                else {
                    let cardArr = this.state.data[this.state.modalIndex].cardDetail.concat(this.state.cardDetail)
                    console.log(cardArr)
                    data[this.state.modalIndex].cardDetail = cardArr
                    this.setState({
                        data,
                        bankName: ' ',
                        bankNumber: ' ',
                        nameOnCard: ' ',
                        mmn: ' ',
                        ssn: ' ',
                        cc: ' ',
                        cvc: ' ',
                        exp: ' ',
                        bal: ' ',
                        aval: ' ',
                        lastPay: ' ',
                        duePay: ' ',
                        aprl: ' ',
                    })
                    console.log("Renderr==>>>", this.state.data[this.state.modalIndex].cardDetail, this.state.modalIndex)

                }

            }
        }

    }
    addNewCard() {
        let { data } = this.state;
        data[this.state.modalIndex].card = false
        this.setState({ data })
        this.setState({
            bankName: " ",
            bankNumber: " ",
            nameOnCard: " ",
            cc: " ",
            cvc: " ",
            exp: " ",
            bal: " ",
            aval: " ",
            lastPay: " ",
            duePay: " ",
            aprl: " ",
            ccBorder: " ",
            ccError: " ",
            cardScheme: "",
            addNewCard: true,
            cardExpire: "",
            ccBackground: "",
            bankNameBorder: "",
            bankNameBackground: "",
            bankNumberBorder: "",
            bankNumberBackground: "",
            balBorder: "",
            balBackground: "",
            avalBorder: "",
            avalBackground: "",
            lastPayBorder: "",
            lastPayBackground: "",
            duePayBorder: "",
            duePayBackground: "",
            aprlBorder: "",
            aprlBackground: "",
        })
    }
    cardExpiry(value) {
        let val = value.substring(0, 2);
        let max = '12';
        if (val.length === 1 && val[0] > max[0]) {
            val = '0' + val;
        }
        if (val.length === 2) {
            if (Number(val) === 0) {
                val = '01';

                //this can happen when user paste number
            } else if (val > max) {
                val = max;
            }
        }
        let month = val;
        let date = value.substring(2, 4);

        return month + (date.length ? '/' + date : '');
    }
    cardExpiryCheck() {
        let { exp } = this.state;
        const month = exp.substring(0, 2)
        const year = 20 + exp.substring(3)
        const expiryDate = new Date(year + '-' + month + '-01');
        if (expiryDate < new Date()) {
            this.setState({ expBorder: "red", expBackground: "#f6e0df", cardExpire: true })
        }
        else if (exp === " " || exp.indexOf('/') === -1) {
            this.setState({ expBorder: "red", expBackground: "#f6e0df" })
        }
        else {
            if (exp.indexOf(" ") === -1 && exp.length === 5) {
                this.setState({
                    expBorder: "green", expBackground: "#d4eed8", cardExpire: false
                })
            }
        }
    }
    onCLose() {
        let { data } = this.state;
        if (data[this.state.modalIndex].cardDetail !== "") {
            data[this.state.modalIndex].card = true
        }
        this.setState({
            modalIndex: 0,
            modal: "none",
            edit: false,
            cardIndex: 0,
            addNewCard: false,
            pointerEvents: "auto"

        })
        this.reset()
    }
    saleTransfer(closer, i) {
        let { data, transferPassword } = this.state;
        var today = new Date();
        let user = firebase.auth().currentUser;
        let that = this;
        var date = today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear();
        if (typeof closer === 'undefined' || transferPassword === "") {
            this.setState({
                transferErrorDisplay: "block"
            })
        } else {
            firebase.auth().signInAndRetrieveDataWithEmailAndPassword(user.email, transferPassword)
                .then((res) => {
                    let Closer = JSON.parse(closer.transferCloser);
                    data[i].status.status = "Transfer";
                    data[i].status.transferCloserID = Closer.id;
                    data[i].status.transferCloserName = Closer.name;
                    data[i].status.statusFromCloser = "Pending";
                    data[i].status.statusCloser = "Pending";
                    data[i].status.transferDate = date;
                    firebase.database().ref('/').child(`NewDeals/${date}/${Closer.id}/${data[i].key}`).set(data[i])
                        .then(() => {
                            if (data[i].date !== date) {
                                firebase.database().ref('/').child(`NewDeals/${data[i].date}/${data[i].uid}/${data[i].key}`).set(data[i])
                                    .then(() => {
                                        firebase.database().ref('/').child(`NewDeals/${date}/${data[i].uid}/${data[i].key}`).remove()
                                        this.setState({
                                            data: this.state.data
                                        })
                                    })
                            } else {
                                firebase.database().ref('/').child(`NewDeals/${date}/${data[i].uid}/${data[i].key}`).set(data[i])
                                    .then(() => {
                                        if (data[i].date !== date) {
                                            firebase.database().ref('/').child(`NewDeals/${data[i].date}/${data[i].uid}/${data[i].key}`).remove()
                                            this.setState({
                                                data: this.state.data
                                            })
                                        }
                                    })
                            }
                        })
                    that.setState({
                        transferErrorDisplay: "none"
                    })
                })
                .catch(function (error) {
                    // Handle Errors here.
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    if (errorCode === 'auth/wrong-password') {
                        that.setState({
                            transferErrorDisplay: "block",
                            transferErrorMessage: "Incorrect password !"
                        })
                    } else {
                        that.setState({
                            transferErrorDisplay: "block",
                            transferErrorMessage: errorMessage
                        })
                    }
                });
        }
    }
    componentWillUnmount() {
        this._isMounted = false;
    }
    reset() {
        this.setState({
            modalIndex: 0,
            modal: "none",
            edit: false,
            fullName: ' ',
            phone: ' ',
            cell: ' ',
            address: ' ',
            city: ' ',
            state: ' ',
            zipCode: ' ',
            email: ' ',
            dob: ' ',
            bankName: ' ',
            bankNumber: ' ',
            nameOnCard: ' ',
            mmn: ' ',
            ssn: ' ',
            cc: ' ',
            cvc: ' ',
            exp: ' ',
            bal: ' ',
            aval: ' ',
            lastPay: ' ',
            duePay: ' ',
            aprl: ' ',
            cardIndex: 0,
            focused: "cc",
            ccError: "",
            ccBorder: "",
            cardDetail: [],
            addNewCard: false,
            ccBackground: "",
            bankNameBorder: "",
            bankNameBackground: "",
            bankNumberBorder: "",
            bankNumberBackground: "",
            balBorder: "",
            balBackground: "",
            avalBorder: "",
            avalBackground: "",
            lastPayBorder: "",
            lastPayBackground: "",
            duePayBorder: "",
            duePayBackground: "",
            aprlBorder: "",
            aprlBackground: "",
            cardExpire: "",
            cardScheme: "",
            transferCloser: [],
            Notes: " "
        })
    }
    transferModalOpen(i) {
        let { transferModal } = this.state;
        transferModal[i].display = "block"
        this.setState({
            transferModal: transferModal,
            pointerEvents: "none"
        })
    }
    onTransferCLose(i) {
        let { transferModal } = this.state;
        transferModal[i].display = "none"
        this.setState({
            transferModal: transferModal,
            pointerEvents: "auto",
            transferCloser: []
        })
    }
    searchUpdated(term) {
        this.setState({ searchTerm: term })
    }
    handleBlur() {
        var is_valid = luhn.validate(this.state.cc);
        fetch(`https://lookup.binlist.net/${this.state.cc}`)
            .then(response => response.json())
            .then((json) => {
                if (json.bank.phone !== undefined) {
                    this.setState({
                        bankNumber: json.bank.phone,
                        bankNumberBackground: "#d4eed8",
                        bankNumberBorder: "green"
                    })
                }
                if (json.bank.name !== undefined) {
                    this.setState({
                        bankName: json.bank.name,
                        bankNameBackground: "#d4eed8",
                        bankNameBorder: "green"
                    })
                }
                this.setState({ cardScheme: json.scheme })
            })
            .catch((err) => {
                console.log("error", err)
            })
        if (this.state.cc === " ") {
            this.setState({
                ccBorder: "red",
                ccBackground: "#f6e0df",
                ccError: "Insert card number ☒",
            })
        }
        else if (is_valid === false) {
            this.setState({
                ccBorder: "red",
                ccBackground: "#f6e0df",
                ccError: "Invalid card number ✗",
            })
        }
        else if (this.state.oldCardList.indexOf(this.state.cc.replace(/\s/g, '')) !== -1) {
            this.setState({
                ccBorder: "#c62828",
                ccBackground: "",
                ccError: "This card already used please contact to Admin!",
            })
        }
        else {
            this.setState({
                ccBackground: "#d4eed8",
                ccBorder: "green",
                ccError: "Valid Card Number ✓",
            })
        }
    }
    render() {
        const filter = this.state.data.filter(createFilter(this.state.searchTerm, KEYS_TO_FILTERS))
        let { fullName, phone, phone2, cell, address, city, state, zipCode, Notes, email,
            dob, bankName, bankNumber, nameOnCard,
            mmn, ssn, cc, cvc, exp, bal, aval, lastPay, lastPayDate, duePay, duePayDate, aprl } = this.state;
        return (
            <div className="animated fadeIn">
                <Row style={{ pointerEvents: this.state.pointerEvents }}>
                    <Col xs="12" lg="12">
                        <Card>
                            <CardHeader style={{ backgroundColor: "#2f353a", color: "#fff" }}>
                                <i className="fa fa-align-justify" style={{ marginTop: 10 }}></i> All Sales
                                <div className="card-header-actions">
                                    <SearchInput style={{ width: '100%', height: '35px', borderRadius: "28px" }} className="search-input" onChange={this.searchUpdated} placeholder="Search Sales" />
                                    <i className="fa fa-search" style={{ position: "absolute", right: 35, top: 23, color: "#000" }}></i>
                                </div>
                            </CardHeader>
                            <CardBody>
                                <Table responsive>
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Full Name</th>
                                            <th>Contact Number</th>
                                            <th>Time</th>
                                            <th>Date</th>
                                            <th>Status</th>
                                            <th>View</th>
                                            {/* <th>Closer</th> */}
                                            <th>Transfer</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filter.map((v, i) => {
                                            return (
                                                <tr key={i}>
                                                    <td>{v.ID}</td>
                                                    <td>{v.fullName}</td>
                                                    <td>{v.status.status === "Transfer" || v.status.status === "Dublicated" ? <b>✦✦✦✦✦✦✦✦✦✦</b> : v.phone}</td>
                                                    <td>{v.time}</td>
                                                    <td>{v.date}</td>
                                                    <td title={v.status.status === "Call Back" ? v.status.callbackDate + " " + v.status.callbackTime : ""}>
                                                        <Badge style={{ width: 100, height: 25, paddingTop: 7, backgroundColor: v.status.status === "Pending" ? '#ffab00' : v.status.status === "Transfer" ? '#e4e5e6' : v.status.status === "Kick Back" ? "#ff7043" : v.status.status === "Dublicated" ? "#ff8a65" : '#81d4fa' }}><i className={v.status.status === "Pending" ? "fa fa-spinner" : v.status.status === "Transfer" ? "fa fa-exchange" : v.status.status === "Kick Back" ? "fa fa-backward" : v.status.status === "Dublicated" ? "fa fa-clone" : "fa fa-phone"}></i>{v.status.status === "Call Back" ? <i className="fa fa-clock"></i> : " "} {v.status.status}</Badge>
                                                    </td>

                                                    <td>
                                                        {v.status.status === "Dublicated" ?
                                                            <Button size="sm" color={'dark'} disabled><i className="fa fa-exclamation-circle"></i> Disabled</Button>
                                                            :
                                                            <Button size="sm" color={v.status.status === "Transfer" ? 'dark' : 'primary'} onClick={this.showModal.bind(this, i)} disabled={v.status.status === "Transfer" ? true : v.status.status === "Dublicated" ? true : false} ><i className={v.status.status === "Transfer" ? "fa fa-exclamation-circle" : "fa fa-search"}></i> {v.status.status === "Transfer" ? "Disabled" : "View"}</Button>
                                                        }
                                                    </td>
                                                    {v.status.status === "Transfer" ?
                                                        <td><Button title={"To " + v.status.transferCloserName} size="sm" color={'dark'} disabled><i className="fa fa-check"></i> Transferred</Button></td>
                                                        :
                                                        v.status.status === "Dublicated" ?
                                                            <td><Button title={"Dublicated"} size="sm" color={'dark'} disabled><i className="fa fa-exclamation-circle"></i> Disabled</Button></td>
                                                            :
                                                            <td>
                                                                <Button size="sm" color={'success'} disabled={v.status.status === "Dublicated" ? true : false} onClick={this.transferModalOpen.bind(this, i)}><i className="fa fa-exchange"></i> Transfer</Button>
                                                                <div id="transferModal" className="modal" style={{ position: 'fixed', zIndex: 1, paddingTop: '100px', left: 0, top: 0, right: 0, width: '40%', height: '100%', overflow: 'auto', margin: "0 auto", marginTop: "90px", display: this.state.transferModal[i].display }}>
                                                                    <div className="modal-content">
                                                                        <div><p style={{ float: 'left', marginTop: 5 }}><b>ID#{v.ID}</b></p><p style={{ float: 'right' }} className="close" onClick={this.onTransferCLose.bind(this, i)}>&times;</p></div>
                                                                        <label>Select Closer</label>
                                                                        <select className="format" value={typeof this.state.transferCloser[i] === "undefined" ? "Select" : this.state.transferCloser[i].transferCloser}
                                                                            onChange={(e) => {
                                                                                let { transferCloser } = this.state;
                                                                                transferCloser[i] = { transferCloser: e.target.value };
                                                                                this.setState({ transferCloser: this.state.transferCloser })
                                                                            }}>
                                                                            <option value="Select">Select</option>
                                                                            {this.props.closers.map((v, i) => {
                                                                                return <option key={i} value={JSON.stringify({ id: v.uid, name: v.username })} name={v.username}>{v.username}</option>
                                                                            })}
                                                                        </select>
                                                                        {typeof this.state.transferCloser[i] === "undefined" || this.state.transferCloser[i].transferCloser === "Select" ?
                                                                            null
                                                                            :
                                                                            <div>
                                                                                <label>Password</label>
                                                                                <input type="password" placeholder="Enter your account password" onChange={(e) => this.setState({ transferPassword: e.target.value })} className="format" />
                                                                            </div>
                                                                        }
                                                                        <br />
                                                                        <Button size="sm" color={'success'} style={{ padding: 6, marginTop: 2 }} onClick={() => this.saleTransfer(this.state.transferCloser[i], i)}><i className="fa fa-exchange"></i>{" "} Transfer</Button>
                                                                        <div style={{ textAlign: "center", display: this.state.transferErrorDisplay }}><span style={{ color: "red" }}>{this.state.transferErrorMessage}</span></div>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                    }
                                                </tr>
                                            )
                                        }).reverse()}
                                    </tbody>
                                </Table>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
                <div id="transferModal" className="modalView" style={{ position: 'fixed', zIndex: 1, paddingTop: '100px', left: 0, top: 0, right: 0, width: '60%', height: '100%', overflow: 'auto', margin: "0 auto", display: this.state.modal }}>
                    <div>
                        <div className="modal-content">
                            <div style={{ float: 'right' }} onClick={this.onCLose.bind(this)}><p className="close"><i className="fa fa-times"></i></p></div>
                            <Col xs="12" lg="12" sm="12">
                                <Card>
                                    {this.state.edit === true ?
                                        <CardBody>
                                            {typeof this.state.data[this.state.modalIndex] === "undefined" ?
                                                null
                                                :
                                                this.state.data[this.state.modalIndex].card === true
                                                    ?
                                                    <div>
                                                        <Table responsive bordered style={{ textAlign: "center" }}>
                                                            <thead>
                                                                <tr>
                                                                    <th colSpan="2"><b><i className="fa fa-date"></i> {this.state.data[this.state.modalIndex].date}</b></th>
                                                                    <th colSpan="2"><b><i className="fa fa-time"></i> {this.state.data[this.state.modalIndex].time}</b></th>
                                                                </tr>
                                                                <tr>
                                                                    <th colSpan="2"><b><i className="fa fa-user"></i> Customar Detail</b></th>
                                                                    <th colSpan="2"><b><i className="fa fa-credit-card"></i> Card Detail</b></th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                <tr>
                                                                    <td><b>Full Name</b></td>
                                                                    <td><input type="text" className="format" value={fullName === " " ? this.state.data[this.state.modalIndex].fullName : fullName} onChange={e => this.setState({ fullName: e.target.value })} /></td>
                                                                    <td colSpan="2" rowSpan="4">
                                                                        <FormGroup row className="my-0">
                                                                            <Col xs="12">
                                                                                <Col xs="12">
                                                                                    <FormGroup>
                                                                                        <Label htmlFor="city">CC</Label>
                                                                                        <NumberFormat style={{ backgroundColor: "#e4e7ea" }} disabled displayType={'input'} className="format" format="################" id="cc" placeholder="Credit Card Number" value={cc === " " ? this.state.data[this.state.modalIndex].cardDetail[this.state.cardIndex].cc : cc} onBlur={this.handleBlur.bind(this)} onChange={e => this.setState({ cc: e.target.value })} />
                                                                                        {this.state.ccError === "" ?
                                                                                            null
                                                                                            :
                                                                                            <p style={{ color: this.state.ccBorder, float: "right", marginBottom: "0rem" }}>{this.state.ccError}</p>
                                                                                        }
                                                                                    </FormGroup>
                                                                                </Col>
                                                                                <Col xs="12">
                                                                                    <FormGroup>
                                                                                        <Label htmlFor="vat">Name On Card</Label>
                                                                                        <Input disabled type="text" id="nameOnCard" placeholder="Name On Card" value={nameOnCard === " " ? this.state.data[this.state.modalIndex].cardDetail[this.state.cardIndex].nameOnCard : nameOnCard} onChange={e => this.setState({ nameOnCard: e.target.value })} />
                                                                                    </FormGroup>
                                                                                </Col>
                                                                                <Col xs="12">
                                                                                    <FormGroup row className="my-0">
                                                                                        <Col xs="6">
                                                                                            <FormGroup>
                                                                                                <Label htmlFor="postal-code">CVC</Label>
                                                                                                <NumberFormat style={{ backgroundColor: "#e4e7ea" }} disabled displayType={'input'} className="format" id="cvc" format="###" placeholder="Customer Verification Code" value={cvc === " " ? this.state.data[this.state.modalIndex].cardDetail[this.state.cardIndex].cvc : cvc} onChange={e => this.setState({ cvc: e.target.value })} />
                                                                                            </FormGroup>
                                                                                        </Col>
                                                                                        <Col xs="6">
                                                                                            <FormGroup>
                                                                                                <Label htmlFor="country">Exp#</Label>
                                                                                                <NumberFormat style={{ backgroundColor: "#e4e7ea" }} disabled format={this.cardExpiry} className="format" id="exp" placeholder="CC Expiration" value={exp === " " ? this.state.data[this.state.modalIndex].cardDetail[this.state.cardIndex].exp : exp} onChange={e => this.setState({ exp: e.target.value })} />

                                                                                            </FormGroup>
                                                                                        </Col>
                                                                                    </FormGroup>
                                                                                </Col>

                                                                            </Col>
                                                                        </FormGroup>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td><b>Phone</b></td>
                                                                    <td>
                                                                        <NumberFormat format="+# (###) ###-####" style={{ borderColor: this.state.phoneBorder }} className="format" value={phone === " " ? this.state.data[this.state.modalIndex].phone : phone} onChange={e => this.setState({ phone: e.target.value })} onBlur={() => { if (this.state.oldPhoneList.indexOf(phone) !== -1) { this.setState({ phoneBorder: '#c62828', phoneError: "This Phone already used please contact to admin" }) } }} />
                                                                        {this.state.phoneError === "" ?
                                                                            null
                                                                            :
                                                                            <small style={{ color: 'red', float: 'right' }}>{this.state.phoneError}</small>
                                                                        }
                                                                    </td>

                                                                </tr>
                                                                <tr>
                                                                    <td><b>Cell</b></td>
                                                                    <td><NumberFormat className="format" value={cell === " " ? this.state.data[this.state.modalIndex].cell === " " ? "Not Provided" : this.state.data[this.state.modalIndex].cell : cell} onChange={e => this.setState({ cell: e.target.value })} /></td>
                                                                </tr>
                                                                <tr>
                                                                    <td><b>Address</b></td>
                                                                    <td><input type="text" className="format" value={address === " " ? this.state.data[this.state.modalIndex].address : address} onChange={e => this.setState({ address: e.target.value })} /></td>
                                                                </tr>
                                                                <tr>
                                                                    <td><b>City</b></td>
                                                                    <td><input type="text" className="format" value={city === " " ? this.state.data[this.state.modalIndex].city : city} onChange={e => this.setState({ city: e.target.value })} /></td>
                                                                    <td><b>Bank Name</b></td>
                                                                    <td><input type="text" className="format" value={bankName === " " ? this.state.data[this.state.modalIndex].cardDetail[this.state.cardIndex].bankName : bankName} onChange={e => this.setState({ bankName: e.target.value })} /></td>
                                                                </tr>
                                                                <tr>
                                                                    <td><b>State</b></td>
                                                                    <td><input type="text" className="format" value={state === " " ? this.state.data[this.state.modalIndex].state : state} onChange={e => this.setState({ state: e.target.value })} /></td>
                                                                    <td><b>Bank Number</b></td>
                                                                    <td><NumberFormat className="format" value={bankNumber === " " ? this.state.data[this.state.modalIndex].cardDetail[this.state.cardIndex].bankNumber === "" ? "Not Provided" : this.state.data[this.state.modalIndex].cardDetail[0].bankNumber : bankNumber} onChange={e => this.setState({ bankNumber: e.target.value })} /></td>
                                                                </tr>
                                                                <tr>
                                                                    <td><b>Zip Code</b></td>
                                                                    <td><NumberFormat className="format" value={zipCode === " " ? this.state.data[this.state.modalIndex].zipCode : zipCode} onChange={e => this.setState({ zipCode: e.target.value })} /></td>
                                                                    <td><b>Balance</b></td>
                                                                    <td><NumberFormat className="format" prefix={'$'} thousandSeparator={true} value={bal === " " ? this.state.data[this.state.modalIndex].cardDetail[this.state.cardIndex].bal : bal} onChange={e => this.setState({ bal: e.target.value })} /></td>
                                                                </tr>
                                                                <tr>
                                                                    <td><b>Email</b></td>
                                                                    <td><input type="text" className="format" value={email === " " ? this.state.data[this.state.modalIndex].email === "" ? "Not Provided" : this.state.data[this.state.modalIndex].email : email} onChange={e => this.setState({ email: e.target.value })} /></td>
                                                                    <td><b>Available</b></td>
                                                                    <td><NumberFormat className="format" prefix={'$'} thousandSeparator={true} value={aval === " " ? this.state.data[this.state.modalIndex].cardDetail[this.state.cardIndex].aval : aval} onChange={e => this.setState({ aval: e.target.value })} /></td>
                                                                </tr>
                                                                <tr>
                                                                    <td><b>DOB</b></td>
                                                                    <td><input type="date" className="format" value={dob === " " ? this.state.data[this.state.modalIndex].dob : dob} onChange={e => this.setState({ dob: e.target.value })} /></td>
                                                                    <td><b>Last Pay</b></td>
                                                                    <td>
                                                                        <NumberFormat className="format" prefix={'$'} thousandSeparator={true} value={lastPay === " " ? this.state.data[this.state.modalIndex].cardDetail[this.state.cardIndex].lastPay : lastPay} onChange={e => this.setState({ lastPay: e.target.value })} />
                                                                        <NumberFormat className="format" format="##/##" placeholder="MM/DD" value={lastPayDate === " " ? this.state.data[this.state.modalIndex].cardDetail[this.state.cardIndex].lastPayDate : lastPayDate} onChange={e => this.setState({ lastPayDate: e.target.value })} />
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td><b>MMN</b></td>
                                                                    <td><input type="text" className="format" value={mmn === " " ? this.state.data[this.state.modalIndex].mmn : mmn} onChange={e => this.setState({ mmn: e.target.value })} /></td>
                                                                    <td><b>Due Pay</b></td>
                                                                    <td><NumberFormat className="format" prefix={'$'} thousandSeparator={true} value={duePay === " " ? this.state.data[this.state.modalIndex].cardDetail[this.state.cardIndex].duePay : duePay} onChange={e => this.setState({ duePay: e.target.value })} />
                                                                        <NumberFormat className="format" format="##/##" placeholder="MM/DD" value={duePayDate === " " ? this.state.data[this.state.modalIndex].cardDetail[this.state.cardIndex].duePayDate : duePayDate} onChange={e => this.setState({ duePayDate: e.target.value })} />
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td><b>SSN</b></td>
                                                                    <td>
                                                                        <NumberFormat format="###-##-####" style={{ borderColor: this.state.SSNBorder }} className="format" value={ssn === " " ? this.state.data[this.state.modalIndex].ssn : ssn} onChange={e => this.setState({ ssn: e.target.value })} onBlur={() => { if (this.state.oldSSNList.indexOf(ssn) !== -1) { this.setState({ SSNBorder: '#c62828', SSNError: "This SSN already used please contact to admin" }) } }} />
                                                                        {this.state.SSNError === "" ?
                                                                            null
                                                                            :
                                                                            <small style={{ color: 'red', float: 'right' }}>{this.state.SSNError}</small>
                                                                        }
                                                                    </td>
                                                                    <td><b>Interest Rate</b></td>
                                                                    <td><NumberFormat className="format" format="##.##%" value={aprl === " " ? this.state.data[this.state.modalIndex].cardDetail[this.state.cardIndex].aprl : aprl} onChange={e => this.setState({ aprl: e.target.value })} /></td>
                                                                </tr>
                                                                <tr>
                                                                    <td><b>Phone2</b></td>
                                                                    <td><NumberFormat format="+# (###) ###-####" className="format" value={phone2 === " " ? this.state.data[this.state.modalIndex].phone2 : phone2} onChange={e => this.setState({ phone2: e.target.value })} /></td>
                                                                    <td colSpan="2"> {
                                                                        this.state.data[this.state.modalIndex].cardDetail.map((v, i) =>
                                                                            <div style={{ display: "inline" }} key={i}>
                                                                                {
                                                                                    v.cardScheme === "mastercard" ?
                                                                                        <span onClick={() => this.setState({ cardIndex: i })} ><Master /></span>
                                                                                        :
                                                                                        v.cardScheme === "visa" ?
                                                                                            <span onClick={() => this.setState({ cardIndex: i })} > <Visa /> </span>
                                                                                            :
                                                                                            v.cardScheme === "discover" ?
                                                                                                <span onClick={() => this.setState({ cardIndex: i })} >  <Discover /> </span>
                                                                                                :
                                                                                                v.cardScheme === "amex" ?
                                                                                                    <span onClick={() => this.setState({ cardIndex: i })} > <Amex /> </span>
                                                                                                    :
                                                                                                    <i className="fa fa-credit-card fa-2x" style={{ marginRight: "3px", color: "##2f353a" }}></i>
                                                                                }
                                                                            </div>
                                                                        )
                                                                    }
                                                                        <i className="fa fa-plus-square fa-2x" style={{ marginRight: "3px", color: "##2f353a", cursor: "pointer" }} onClick={this.addNewCard.bind(this)}></i>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td></td>
                                                                    <td></td>
                                                                    <td colSpan="2">
                                                                        {this.state.addNewCard === true ?
                                                                            <Button size="sm" color="success" style={{ width: "100%", height: "35px" }} onClick={this.saveCard.bind(this)}>Save Credit Card</Button>
                                                                            :
                                                                            null
                                                                        }
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td><b>Notes</b></td>
                                                                    <td colSpan="4"> <FormGroup>
                                                                        <Input type="textarea" name="textarea-input" id="textarea-input" rows="4"
                                                                            placeholder="Content..." value={Notes === " " ? this.state.data[this.state.modalIndex].Notes : Notes} onChange={(e) => this.setState({ Notes: e.target.value })} />
                                                                    </FormGroup>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </Table>
                                                        <Button size="sm" color="success" style={{ width: "100%", height: "35px" }} onClick={this.updateDeal.bind(this)}><i className="fa fa-check"></i>Update</Button>
                                                    </div>
                                                    :
                                                    <div>
                                                        <Table responsive bordered style={{ textAlign: "center" }}>
                                                            <thead>
                                                                <tr>
                                                                    <th colSpan="2"><b><i className="fa fa-date"></i> {this.state.data[this.state.modalIndex].date}</b></th>
                                                                    <th colSpan="2"><b><i className="fa fa-time"></i> {this.state.data[this.state.modalIndex].time}</b></th>
                                                                </tr>
                                                                <tr>
                                                                    <th colSpan="2"><b><i className="fa fa-user"></i> Customar Detail</b></th>
                                                                    <th colSpan="2"><b><i className="fa fa-credit-card"></i> Card Detail</b></th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                <tr>
                                                                    <td><b>Full Name</b></td>
                                                                    <td><input type="text" className="format" value={fullName === " " ? this.state.data[this.state.modalIndex].fullName : fullName} onChange={e => this.setState({ fullName: e.target.value })} /></td>
                                                                    <td colSpan="2" rowSpan="4">
                                                                        <FormGroup row className="my-0">
                                                                            <Col xs="12">
                                                                                <Col xs="12">
                                                                                    <FormGroup>
                                                                                        <Label htmlFor="city">CC</Label>
                                                                                        <NumberFormat displayType={'input'} style={{ borderColor: this.state.ccBorder, backgroundColor: this.state.ccBackground }} className="format" format="################" id="cc" placeholder="Credit Card Number" onBlur={this.handleBlur.bind(this)} value={cc} onChange={e => this.setState({ cc: e.target.value, ccBorder: "", ccError: "", ccBackground: "" })} />
                                                                                        {this.state.ccError === "" ?
                                                                                            null
                                                                                            :
                                                                                            <p style={{ color: this.state.ccBorder, float: "right", marginBottom: "0rem" }}>{this.state.ccError}</p>
                                                                                        }
                                                                                    </FormGroup>
                                                                                </Col>
                                                                                <Col xs="12">
                                                                                    <FormGroup>
                                                                                        <Label htmlFor="vat">Name On Card</Label>
                                                                                        <Input type="text" id="nameOnCard" placeholder="Name On Card" style={{ borderColor: this.state.nameOnCardBorder, backgroundColor: this.state.nameOnCardBackground }} placeholder="Name On Card" value={nameOnCard} onBlur={() => { if (nameOnCard.length > 3) { this.setState({ nameOnCardBorder: "green", nameOnCardBackground: "#d4eed8" }) } else { this.setState({ nameOnCardBorder: "red", nameOnCardBackground: "#f6e0df" }) } }} onChange={e => this.setState({ nameOnCard: e.target.value, nameOnCardBorder: "", nameOnCardBackground: "" })} />
                                                                                    </FormGroup>
                                                                                </Col>
                                                                                <Col xs="12">
                                                                                    <FormGroup row className="my-0">
                                                                                        <Col xs="6">
                                                                                            <FormGroup>
                                                                                                <Label htmlFor="postal-code">CVC</Label>
                                                                                                <NumberFormat displayType={'input'} className="format" style={{ borderColor: this.state.cvcBorder, backgroundColor: this.state.cvcBackground }} id="cvc" format="####" placeholder="Customer Verification Code" value={cvc} onBlur={() => { if (cvc !== " ") { this.setState({ cvcBorder: "green", cvcBackground: "#d4eed8" }) } else { this.setState({ cvcBorder: "red", cvcBackground: "#f6e0df" }) } }} onChange={e => this.setState({ cvc: e.target.value, cvcBorder: "", cvcBackground: "" })} />
                                                                                            </FormGroup>
                                                                                        </Col>
                                                                                        <Col xs="6">
                                                                                            <FormGroup>
                                                                                                <Label htmlFor="country">Exp#</Label>
                                                                                                <NumberFormat format={this.cardExpiry} className="format" style={{ borderColor: this.state.expBorder, backgroundColor: this.state.expBackground }} id="exp" placeholder="CC Expiration" value={exp} onBlur={this.cardExpiryCheck.bind(this)} onChange={e => this.setState({ exp: e.target.value, expBorder: "", expBackground: "" })} />

                                                                                            </FormGroup>
                                                                                        </Col>
                                                                                    </FormGroup>
                                                                                </Col>

                                                                            </Col>
                                                                        </FormGroup>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td><b>Phone</b></td>
                                                                    <td>
                                                                        <NumberFormat format="+# (###) ###-####" style={{ borderColor: this.state.phoneBorder }} className="format" value={phone === " " ? this.state.data[this.state.modalIndex].phone : phone} onChange={e => this.setState({ phone: e.target.value })} onBlur={() => { if (this.state.oldPhoneList.indexOf(phone) !== -1) { this.setState({ phoneBorder: '#c62828', phoneError: "This Phone already used please contact to admin" }) } }} />
                                                                        {this.state.phoneError === "" ?
                                                                            null
                                                                            :
                                                                            <small style={{ color: 'red', float: 'right' }}>{this.state.phoneError}</small>
                                                                        }
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td><b>Cell</b></td>
                                                                    <td><NumberFormat className="format" value={cell === " " ? this.state.data[this.state.modalIndex].cell === "" ? "Not Provided" : this.state.data[this.state.modalIndex].cell : cell} onChange={e => this.setState({ cell: e.target.value })} /></td>
                                                                </tr>
                                                                <tr>
                                                                    <td><b>Address</b></td>
                                                                    <td><input type="text" className="format" value={address === " " ? this.state.data[this.state.modalIndex].address : address} onChange={e => this.setState({ address: e.target.value })} /></td>
                                                                </tr>
                                                                <tr>
                                                                    <td><b>City</b></td>
                                                                    <td><input type="text" className="format" value={city === " " ? this.state.data[this.state.modalIndex].city : city} onChange={e => this.setState({ city: e.target.value })} /></td>
                                                                    <td><b>Bank Name</b></td>
                                                                    <td><input type="text" className="format" placeholder="Bank Name" style={{ borderColor: this.state.bankNameBorder, backgroundColor: this.state.bankNameBackground }} value={bankName} onBlur={() => { if (bankName.length > 2) { this.setState({ bankNameBorder: "green", bankNameBackground: "#d4eed8" }) } else { this.setState({ bankNameBorder: "red", bankNameBackground: "#f6e0df" }) } }} onChange={e => this.setState({ bankName: e.target.value, bankNameBorder: "", bankNameBackground: "" })} /></td>
                                                                </tr>
                                                                <tr>
                                                                    <td><b>State</b></td>
                                                                    <td><input type="text" className="format" value={state === " " ? this.state.data[this.state.modalIndex].state : state} onChange={e => this.setState({ state: e.target.value })} /></td>
                                                                    <td><b>Bank Number</b></td>
                                                                    <td><NumberFormat className="format" placeholder="Bank Number" style={{ borderColor: this.state.bankNumberBorder, backgroundColor: this.state.bankNumberBackground }} value={bankNumber} onBlur={() => { if (bankNumber.length > 3) { this.setState({ bankNumberBorder: "green", bankNumberBackground: "#d4eed8" }) } }} onChange={e => this.setState({ bankNumber: e.target.value, bankNumberBorder: "", bankNumberBackground: "" })} /></td>
                                                                </tr>
                                                                <tr>
                                                                    <td><b>Zip Code</b></td>
                                                                    <td><NumberFormat className="format" value={zipCode === " " ? this.state.data[this.state.modalIndex].zipCode : zipCode} onChange={e => this.setState({ zipCode: e.target.value })} /></td>
                                                                    <td><b>Balance</b></td>
                                                                    <td><NumberFormat className="format" placeholder="Balance" prefix={'$'} style={{ borderColor: this.state.balBorder, backgroundColor: this.state.balBackground }} thousandSeparator={true} value={bal} onBlur={() => { if (bal !== " ") { this.setState({ balBorder: "green", balBackground: "#d4eed8" }) } else { this.setState({ balBorder: "red", balBackground: "#f6e0df" }) } }} onChange={e => this.setState({ bal: e.target.value, balBorder: "", balBackground: "" })} /></td>
                                                                </tr>
                                                                <tr>
                                                                    <td><b>Email</b></td>
                                                                    <td><input type="text" className="format" value={email === " " ? this.state.data[this.state.modalIndex].email === "" ? "Not Provided" : this.state.data[this.state.modalIndex].email : email} onChange={e => this.setState({ email: e.target.value })} /></td>
                                                                    <td><b>Available</b></td>
                                                                    <td><NumberFormat className="format" placeholder="Available" prefix={'$'} style={{ borderColor: this.state.avalBorder, backgroundColor: this.state.avalBackground }} thousandSeparator={true} value={aval} onBlur={() => { if (aval !== " ") { this.setState({ avalBorder: "green", avalBackground: "#d4eed8" }) } else { this.setState({ avalBorder: "red", avalBackground: "#f6e0df" }) } }} onChange={e => this.setState({ aval: e.target.value, avalBorder: "", avalBackground: "" })} /></td>
                                                                </tr>
                                                                <tr>
                                                                    <td><b>DOB</b></td>
                                                                    <td><input type="date" className="format" value={dob === " " ? this.state.data[this.state.modalIndex].dob : dob} onChange={e => this.setState({ dob: e.target.value })} /></td>
                                                                    <td><b>Last Pay</b></td>
                                                                    <td>
                                                                        <NumberFormat className="format" prefix={'$'} placeholder="Last Pay" style={{ borderColor: this.state.lastPayBorder, backgroundColor: this.state.lastPayBackground }} thousandSeparator={true} value={lastPay} onBlur={() => { if (lastPay !== " ") { this.setState({ lastPayBorder: "green", lastPayBackground: "#d4eed8" }) } else { this.setState({ lastPayBorder: "red", lastPayBackground: "#f6e0df" }) } }} onChange={e => this.setState({ lastPay: e.target.value, lastPayBorder: "", lastPayBackground: "" })} />
                                                                        <NumberFormat className="format" format="##/##" style={{ borderColor: this.state.lastPayDateBorder, backgroundColor: this.state.lastPayDateBackground }} placeholder="MM/DD" value={lastPayDate} onBlur={() => { if (lastPayDate !== " " && lastPayDate.indexOf(" ") === -1) { this.setState({ lastPayDateBorder: "green", lastPayDateBackground: "#d4eed8" }) } else { this.setState({ lastPayDateBorder: "red", lastPayDateBackground: "#f6e0df" }) } }} onChange={e => this.setState({ lastPayDate: e.target.value })} />
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td><b>MMN</b></td>
                                                                    <td><input type="text" className="format" value={mmn === " " ? this.state.data[this.state.modalIndex].mmn : mmn} onChange={e => this.setState({ mmn: e.target.value })} /></td>
                                                                    <td><b>Due Pay</b></td>
                                                                    <td>
                                                                        <NumberFormat className="format" prefix={'$'} placeholder="Due Pay" style={{ borderColor: this.state.duePayBorder, backgroundColor: this.state.duePayBackground }} thousandSeparator={true} value={duePay} onBlur={() => { if (duePay !== " ") { this.setState({ duePayBorder: "green", duePayBackground: "#d4eed8" }) } else { this.setState({ duePayBorder: "red", duePayBackground: "#f6e0df" }) } }} onChange={e => this.setState({ duePay: e.target.value, duePayBorder: "", duePayBackground: "" })} />
                                                                        <NumberFormat className="format" format="##/##" style={{ borderColor: this.state.duePayDateBorder, backgroundColor: this.state.duePayDateBackground }} placeholder="MM/DD" value={duePayDate} onBlur={() => { if (duePayDate !== " " && duePayDate.indexOf(" ") === -1) { this.setState({ duePayDateBorder: "green", duePayDateBackground: "#d4eed8" }) } else { this.setState({ duePayDateBorder: "red", duePayDateBackground: "#f6e0df" }) } }} onChange={e => this.setState({ duePayDate: e.target.value })} />
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td><b>SSN</b></td>
                                                                    <td><NumberFormat format="###-##-####" className="format" value={ssn === " " ? this.state.data[this.state.modalIndex].ssn : ssn} onChange={e => this.setState({ ssn: e.target.value })} /></td>
                                                                    <td><b>Interest Rate</b></td>
                                                                    <td><NumberFormat className="format" placeholder="Interest Rate" format="##.##%" style={{ borderColor: this.state.aprlBorder, backgroundColor: this.state.aprlBackground }} value={aprl} onBlur={() => { if (aprl !== " ") { this.setState({ aprlBorder: "green", aprlBackground: "#d4eed8" }) } else { this.setState({ aprlBorder: "red", aprlBackground: "#f6e0df" }) } }} onChange={e => this.setState({ aprl: e.target.value, aprlBorder: "", aprlBackground: "" })} /></td>
                                                                </tr>
                                                                <tr>
                                                                    <td><b>Phone2</b></td>
                                                                    <td><NumberFormat format="+# (###) ###-####" className="format" value={phone2 === " " ? this.state.data[this.state.modalIndex].phone2 : phone2} onChange={e => this.setState({ phone2: e.target.value })} /></td>
                                                                    <td colSpan="2">{this.state.data[this.state.modalIndex].cardDetail === "" ?
                                                                        null
                                                                        :
                                                                        this.state.data[this.state.modalIndex].cardDetail.map((v, i) =>
                                                                            <div style={{ display: "inline" }} key={i}>
                                                                                {
                                                                                    v.cardScheme === "mastercard" ?
                                                                                        <Master />
                                                                                        :
                                                                                        v.cardScheme === "visa" ?
                                                                                            <Visa />
                                                                                            :
                                                                                            v.cardScheme === "discover" ?
                                                                                                <Discover />
                                                                                                :
                                                                                                v.cardScheme === "amex" ?
                                                                                                    <Amex />
                                                                                                    :
                                                                                                    <i className="fa fa-credit-card fa-2x" style={{ marginRight: "3px", color: "##2f353a" }}></i>

                                                                                }
                                                                            </div>
                                                                        )

                                                                    }
                                                                        {this.state.data[this.state.modalIndex].cardDetail === "" ?
                                                                            null
                                                                            :
                                                                            <i className="fa fa-plus-square fa-2x" style={{ marginRight: "3px", color: "##2f353a", cursor: "pointer" }} onClick={this.addNewCard.bind(this)}></i>
                                                                        }
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td></td>
                                                                    <td></td>
                                                                    <td colSpan="2"><Button size="sm" color="success" style={{ width: "100%", height: "35px" }} onClick={this.saveCard.bind(this)}>Save Credit Card</Button></td>
                                                                </tr>
                                                                <tr>
                                                                    <td><b>Notes</b></td>
                                                                    <td colSpan="4"> <FormGroup>
                                                                        <Input type="textarea" name="textarea-input" id="textarea-input" rows="4"
                                                                            placeholder="Content..." value={Notes === " " ? this.state.data[this.state.modalIndex].Notes : Notes} onChange={(e) => this.setState({ Notes: e.target.value })} />
                                                                    </FormGroup>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </Table>
                                                        <Button size="sm" color="success" style={{ width: "100%", height: "35px" }} onClick={this.updateDeal.bind(this)}><i className="fa fa-check"></i>Update</Button>
                                                    </div>

                                            }
                                        </CardBody>
                                        :

                                        <CardBody>
                                            {typeof this.state.data[this.state.modalIndex] === "undefined" ?
                                                null
                                                :
                                                <div>
                                                    {this.state.data[this.state.modalIndex].card === true
                                                        ?
                                                        <Table responsive bordered style={{ textAlign: "center" }}>
                                                            <thead>
                                                                <tr>
                                                                    <th colSpan="2"><b><i className="fa fa-date"></i> {this.state.data[this.state.modalIndex].date}</b></th>
                                                                    <th colSpan="2"><b><i className="fa fa-time"></i> {this.state.data[this.state.modalIndex].time}</b></th>
                                                                </tr>
                                                                <tr>
                                                                    <th colSpan="2"><b><i className="fa fa-user"></i> Customar Detail</b></th>
                                                                    <th colSpan="2"><b><i className="fa fa-credit-card"></i> Card Detail</b></th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                <tr>
                                                                    <td><b>Full Name</b></td>
                                                                    <td>{this.state.data[this.state.modalIndex].fullName}</td>
                                                                    <td colSpan="2" rowSpan="4" onClick={() => { if (this.state.focused === "cc") { this.setState({ focused: "cvc" }) } else { this.setState({ focused: "cc" }) } }}> <Cards
                                                                        number={this.state.data[this.state.modalIndex].cardDetail[this.state.cardIndex].cc}
                                                                        name={this.state.data[this.state.modalIndex].cardDetail[this.state.cardIndex].nameOnCard}
                                                                        expiry={this.state.data[this.state.modalIndex].cardDetail[this.state.cardIndex].exp}
                                                                        cvc={this.state.data[this.state.modalIndex].cardDetail[this.state.cardIndex].cvc}
                                                                        focused={this.state.focused}
                                                                    /></td>
                                                                </tr>
                                                                <tr>
                                                                    <td><b>Phone</b></td>
                                                                    <td>{this.state.data[this.state.modalIndex].phone}</td>
                                                                </tr>
                                                                <tr>
                                                                    <td><b>Cell</b></td>
                                                                    <td>{this.state.data[this.state.modalIndex].cell === "" ? "Not Provided" : this.state.data[this.state.modalIndex].cell}</td>
                                                                </tr>
                                                                <tr>
                                                                    <td><b>Address</b></td>
                                                                    <td>{this.state.data[this.state.modalIndex].address}</td>
                                                                </tr>
                                                                <tr>
                                                                    <td><b>City</b></td>
                                                                    <td>{this.state.data[this.state.modalIndex].city}</td>
                                                                    <td><b>Bank Name</b></td>
                                                                    <td>{this.state.data[this.state.modalIndex].cardDetail[this.state.cardIndex].bankName}</td>
                                                                </tr>
                                                                <tr>
                                                                    <td><b>State</b></td>
                                                                    <td>{this.state.data[this.state.modalIndex].state}</td>
                                                                    <td><b>Bank Number</b></td>
                                                                    <td>{this.state.data[this.state.modalIndex].cardDetail[this.state.cardIndex].bankNumber === "" ? "Not Provided" : this.state.data[this.state.modalIndex].cardDetail[this.state.cardIndex].bankNumber}</td>
                                                                </tr>
                                                                <tr>
                                                                    <td><b>Zip Code</b></td>
                                                                    <td>{this.state.data[this.state.modalIndex].zipCode}</td>
                                                                    <td><b>Balance</b></td>
                                                                    <td>{this.state.data[this.state.modalIndex].cardDetail[this.state.cardIndex].bal}</td>
                                                                </tr>
                                                                <tr>
                                                                    <td><b>Email</b></td>
                                                                    <td>{this.state.data[this.state.modalIndex].email === "" ? "Not Provided" : this.state.data[this.state.modalIndex].email}</td>
                                                                    <td><b>Available</b></td>
                                                                    <td>{this.state.data[this.state.modalIndex].cardDetail[this.state.cardIndex].aval}</td>
                                                                </tr>
                                                                <tr>
                                                                    <td><b>DOB</b></td>
                                                                    <td>{this.state.data[this.state.modalIndex].dob}</td>
                                                                    <td><b>Last Pay</b></td>
                                                                    <td>{this.state.data[this.state.modalIndex].cardDetail[this.state.cardIndex].lastPay}{" "}{"→"}{" "}{this.state.data[this.state.modalIndex].cardDetail[this.state.cardIndex].lastPayDate}</td>
                                                                </tr>
                                                                <tr>
                                                                    <td><b>MMN</b></td>
                                                                    <td>{this.state.data[this.state.modalIndex].mmn}</td>
                                                                    <td><b>Due Pay</b></td>
                                                                    <td>{this.state.data[this.state.modalIndex].cardDetail[this.state.cardIndex].duePay}{" "}{"→"}{" "}{this.state.data[this.state.modalIndex].cardDetail[this.state.cardIndex].duePayDate}</td>
                                                                </tr>
                                                                <tr>
                                                                    <td><b>SSN</b></td>
                                                                    <td>{this.state.data[this.state.modalIndex].ssn}</td>
                                                                    <td><b>Aprl</b></td>
                                                                    <td>{this.state.data[this.state.modalIndex].cardDetail[this.state.cardIndex].aprl}</td>
                                                                </tr>
                                                                <tr>
                                                                    <td><b>Phone2</b></td>
                                                                    <td>{this.state.data[this.state.modalIndex].phone2}</td>
                                                                    <td colSpan="2">
                                                                        {
                                                                            this.state.data[this.state.modalIndex].cardDetail.map((v, i) =>
                                                                                <span style={{ display: "inline" }} key={i}>
                                                                                    {
                                                                                        v.cardScheme === "mastercard" ?
                                                                                            <span onClick={() => this.setState({ cardIndex: i })} ><Master /></span>
                                                                                            :
                                                                                            v.cardScheme === "visa" ?
                                                                                                <span onClick={() => this.setState({ cardIndex: i })} >  <Visa /></span>
                                                                                                :
                                                                                                v.cardScheme === "discover" ?
                                                                                                    <span onClick={() => this.setState({ cardIndex: i })} > <Discover /></span>
                                                                                                    :
                                                                                                    v.cardScheme === "amex" ?
                                                                                                        <span onClick={() => this.setState({ cardIndex: i })} > <Amex /> </span>
                                                                                                        :
                                                                                                        <i className="fa fa-credit-card fa-2x" style={{ marginRight: "3px", color: "##2f353a" }} onClick={() => this.setState({ cardIndex: i })}></i>

                                                                                    }
                                                                                </span>
                                                                            )
                                                                        }
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td><b>Notes</b></td>
                                                                    <td colSpan="4">{this.state.data[this.state.modalIndex].Notes}</td>
                                                                </tr>
                                                                {this.state.data[this.state.modalIndex].status.status === "Kick Back" ?
                                                                    <tr>
                                                                        <td><b>Closer Notes</b></td>
                                                                        <td colSpan="4">{this.state.data[this.state.modalIndex].CloserNotes}</td>
                                                                    </tr>
                                                                    :
                                                                    null
                                                                }
                                                            </tbody>
                                                        </Table>
                                                        :
                                                        <Table responsive bordered style={{ textAlign: "center" }}>
                                                            <thead>
                                                                <tr>
                                                                    <th colSpan="2"><b><i className="fa fa-date"></i> {this.state.data[this.state.modalIndex].date}</b></th>
                                                                    <th colSpan="2"><b><i className="fa fa-time"></i> {this.state.data[this.state.modalIndex].time}</b></th>
                                                                </tr>
                                                                <tr>
                                                                    <th colSpan="2"><b><i className="fa fa-user"></i> Customar Detail</b></th>
                                                                    <th colSpan="2"><b><i className="fa fa-credit-card"></i> Card Detail</b></th>
                                                                </tr>

                                                            </thead>
                                                            <tbody>
                                                                <tr>
                                                                    <td><b>Full Name</b></td>
                                                                    <td>{this.state.data[this.state.modalIndex].fullName}</td>
                                                                    <td rowSpan="8">Not Given</td>
                                                                </tr>
                                                                <tr>
                                                                    <td><b>Phone</b></td>
                                                                    <td>{this.state.data[this.state.modalIndex].phone}</td>
                                                                </tr>
                                                                <tr>
                                                                    <td><b>Cell</b></td>
                                                                    <td>{this.state.data[this.state.modalIndex].cell === "" ? "Not Provided" : this.state.data[this.state.modalIndex].cell}</td>
                                                                </tr>
                                                                <tr>
                                                                    <td><b>Address</b></td>
                                                                    <td>{this.state.data[this.state.modalIndex].address}</td>
                                                                </tr>
                                                                <tr>
                                                                    <td><b>City</b></td>
                                                                    <td>{this.state.data[this.state.modalIndex].city}</td>
                                                                </tr>
                                                                <tr>
                                                                    <td><b>State</b></td>
                                                                    <td>{this.state.data[this.state.modalIndex].state}</td>
                                                                </tr>
                                                                <tr>
                                                                    <td><b>Zip Code</b></td>
                                                                    <td>{this.state.data[this.state.modalIndex].zipCode}</td>
                                                                </tr>
                                                                <tr>
                                                                    <td><b>Email</b></td>
                                                                    <td>{this.state.data[this.state.modalIndex].email === "" ? "Not Provided" : this.state.data[this.state.modalIndex].email}</td>
                                                                </tr>
                                                                <tr>
                                                                    <td><b>DOB</b></td>
                                                                    <td>{this.state.data[this.state.modalIndex].dob}</td>
                                                                </tr>
                                                                <tr>
                                                                    <td><b>MMN</b></td>
                                                                    <td>{this.state.data[this.state.modalIndex].mmn}</td>
                                                                </tr>
                                                                <tr>
                                                                    <td><b>SSN</b></td>
                                                                    <td>{this.state.data[this.state.modalIndex].ssn}</td>
                                                                </tr>
                                                                <tr>
                                                                    <td><b>Phone2</b></td>
                                                                    <td>{this.state.data[this.state.modalIndex].phone2}</td>
                                                                </tr>
                                                                <tr>
                                                                    <td></td>
                                                                    <td></td>
                                                                </tr>
                                                                <tr>
                                                                    <td></td>
                                                                    <td></td>
                                                                </tr>
                                                                <tr>
                                                                    <td></td>
                                                                    <td></td>
                                                                </tr>
                                                                <tr>
                                                                    <td><b>Notes</b></td>
                                                                    <td colSpan="4">{this.state.data[this.state.modalIndex].Notes}</td>
                                                                </tr>
                                                                {this.state.data[this.state.modalIndex].status.status === "Kick Back" ?
                                                                    <tr>
                                                                        <td><b>Closer Notes</b></td>
                                                                        <td colSpan="4">{this.state.data[this.state.modalIndex].CloserNotes}</td>
                                                                    </tr>
                                                                    :
                                                                    null
                                                                }
                                                            </tbody>
                                                            {/* <div>Notes: {this.state.data[this.state.modalIndex].Notes}</div> */}
                                                        </Table>
                                                    }
                                                    <Button size="sm" color="success" style={{ width: "100%", height: "35px" }} onClick={() => this.setState({ edit: true })}><i className="fa fa-edit"></i>Edit</Button>

                                                </div>

                                            }
                                        </CardBody>
                                    }
                                </Card>
                            </Col>
                        </div>

                    </div>
                </div>
            </div>
        );
    }
}
function mapStateToProp(state) {
    return ({
        closers: state.root.closers
    })
}
function mapDispatchToProp(dispatch) {
    return ({
        updateDeal: (data) => { dispatch(updateDeal(data)) },
        getUser: (user, agent) => { dispatch(getUser(user, agent)) }
    })
}


export default connect(mapStateToProp, mapDispatchToProp)(AllSell);
