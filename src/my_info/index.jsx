import React, {Component} from 'react';
import {connect} from 'react-redux';
import { 
    WhiteSpace, WingBlank, List, InputItem, ImagePicker, Toast, DatePicker, Picker
 } from 'antd-mobile';
import moment from 'moment';
import WxImageViewer from 'react-wx-images-viewer';
import QueueAnim from 'rc-queue-anim';

import CommonService from '@/common/services/common/common.service';
import userIcon from '@/my_info/assets/images/user_icon.png';
import birdthdayIocn from '@/my_info/assets/images/birdthday_icon.png';
import genderIcon from '@/my_info/assets/images/gender_icon.png';
import phoneIcon from '@/my_info/assets/images/phone_icon.png';
import MobileButton from '@/common/components/mobile_button/MobileButton';
import {GetMemberInfoAction} from '@/base/redux/actions';
import MyInfoService from './services/my_info.service';

const Item = List.Item;

class MyInfo extends Component {
    state = {
        title: '我的信息',
        avatar: [],
        date: null,
        sexdata: [
            {label: '男', value: '1'},
            {label: '女', value: '0'},
            {label: '保密', value: '2'}
        ],
        sex: ['1'],
        nikeName: '',
        mobile: '',
        isViewavatar: false
    };

    componentDidMount() {
        const {MemberInfo} = this.props;
        MyInfoService.GetPersonalInfo(MemberInfo.id).then(res => {
            if (res) {
                let myinfo = {
                    avatar: res.headimgUrl ? [{url: res.headimgUrl}] : [],
                    date: res.birthday ? new Date(res.birthday) : null,
                    sex: res.sex ? [res.sex] : ['0'],
                    mobile: res.mobile || '-',
                    nikeName: res.name || ''
                };
                this.setState({...myinfo})
            }
        })
    }

    /**
     * 选择上传头像
     */
    uploadAvatar = (files, operationType, index) => {
        if (operationType == 'remove') {
            files.slice(index, 1);
            this.setState({avatar: files});
        } else {
            if (files.length > 0) {
                if (files[0].file.size > 2048 * 1024) {
                    Toast.info('头像大小需小于2M', 2);
                    return;
                }
                CommonService.Upload(files[0].file).then(res => {
                    if (res.results.length > 0) {
                        const avatar = [{url: res.results[0].url}];
                        this.setState({avatar})
                    }
                })   
            }
        }
    }

    /**
     * 头像上传失败时
     */
    uploadFail = () => {
        Toast.fail('头像上传失败', 2)
    }

    /**
     * 选择生日
     */
    selectDate = (val) => {
        console.log(moment(val).format('YYYY-MM-DD'))
    }

    /**
     * 选择性别
     */
    selectSex = (sex) => {
        this.setState({sex});
    }

    /**
     * 点击图片时触发
     */
    onImageClick = (index, files) => {
        // files.slice(index, 1);
        // this.setState({avatar: files});
        this.setState({isViewavatar: true});
    }

    /**
     * 提交保存
     */
    Save = (e) => {
        e.preventDefault();
        const {MemberInfo, GetMemberInfoAction} = this.props;
        const {sex, avatar, date, nikeName} = this.state;
        const _self = this;
        MyInfoService.UpdatePersonalInfo({
            birthday: date != null ? moment(date).format('YYYY-MM-DD') : '',
            headimgUrl: avatar.length > 0 ? avatar[0].url : '',
            id: MemberInfo.id,
            name: nikeName != '' ? nikeName : '',
            sex: sex.length > 0 ? parseInt(sex.toString()) : null
        }).then(res => {
            Toast.success('更新成功', 2, () => {
                // 更新会员信息状态
                GetMemberInfoAction();
                _self.props.history.push('/app/home');
            });
        })
    }

    onClose = () => {
        this.setState({isViewavatar: false});
    }

    render() {
        const {sex, avatar, date, sexdata, nikeName, mobile, isViewavatar} = this.state;
        const avatar_url = avatar.length > 0 ? [avatar[0].url] : [];
        return (
            <QueueAnim style={{height:'100%'}} type={['right', 'left']} delay={200} duration={1500} leaveReverse={true} forcedReplay={true}>
                <div className="my-info" key="my_info">
                    {
                        isViewavatar ? <WxImageViewer onClose={this.onClose} urls={avatar_url} /> : ""
                    }
                    <List>
                        <Item                            
                            arrow="horizontal"
                            extra={
                                <ImagePicker
                                    files={avatar}
                                    length="1"
                                    onChange={this.uploadAvatar}
                                    selectable={avatar.length < 1}
                                    onImageClick={this.onImageClick}
                                />}
                        >
                            <div className="list-label">头像</div>
                        </Item>
                    </List>
                    <List style={{height: 32, backgroundColor: '#F6F6F6'}}></List>
                    <List>
                        <InputItem
                            value={nikeName}
                            onChange={(val) => {this.setState({nikeName: val})}}
                            placeholder="请输入昵称"
                            extra={
                                <div className="am-list-arrow am-list-arrow-horizontal" aria-hidden="true" />
                            }
                        >
                            <div>
                                <div className="icon-img" style={{ backgroundImage: 'url(' + userIcon + ')', backgroundSize: 'cover'}} />
                                <div className="list-label">昵称</div>
                            </div>
                        </InputItem>
                        <Picker
                            data={sexdata}
                            value={sex}
                            cols={1}
                            title="选择性别"
                            onOk={this.selectSex}
                            extra={sex.length > 0 ? sexdata.find(s=>s.value==sex[0]).label: '请完善'}
                        >
                            <Item arrow="horizontal">
                                <div>
                                    <div className="icon-img" style={{ backgroundImage: 'url(' + genderIcon + ')', backgroundSize: 'cover'}} />
                                    <div className="list-label">性别</div>
                                </div>
                            </Item>
                        </Picker>
                        <DatePicker
                            mode="date"
                            title="选择生日"
                            extra="请完善"
                            minDate={new Date('1900-01-01')}
                            maxDate={new Date()}
                            format="YYYY-MM-DD"
                            value={date}
                            onChange={date => this.setState({ date })}
                            onOk={this.selectDate}
                        >
                            <Item arrow="horizontal">
                                <div>
                                    <div className="icon-img" style={{ backgroundImage: 'url(' + birdthdayIocn + ')', backgroundSize: 'cover'}} />
                                    <div className="list-label">生日</div>
                                </div>
                            </Item>
                        </DatePicker>
                        <Item
                            arrow="empty"
                            extra={<span>{mobile}</span>}
                        >
                            <div>
                                <div className="icon-img" style={{ backgroundImage: 'url(' + phoneIcon + ')', backgroundSize: 'cover'}} />
                                <div className="list-label">手机号</div>
                            </div>
                        </Item>
                    </List>
                    <WhiteSpace size="xl" />
                    <WingBlank size="md">
                        <MobileButton text="确 认" handleClick={this.Save} buttonClass="longButton" />
                    </WingBlank>
                    {
                        <style>
                            {
                                `
                                .am-list-item .am-input-control input {
                                    font-size: 16px !important;
                                    text-align: right !important;
                                }
                                .am-list-item .am-list-line .am-list-extra {
                                    flex-basis: 75%;
                                }
                                .html:not([data-scale]) .am-list-body div:not(:last-child) .am-list-line::after {
                                    background-color: #ffffff !important;
                                    height: 0 !important;
                                }
                                .am-list-item .am-list-line {
                                    padding-right: 0;
                                }
                                .am-list-body {
                                    padding-right: 14px !important;
                                }
                                `
                            }
                        </style>
                    }
                </div>
            </QueueAnim>
        )
    }
}

export default connect(
    state => ({
        MemberInfo: state.MemberInfo
    }),
    {GetMemberInfoAction}
)(MyInfo);