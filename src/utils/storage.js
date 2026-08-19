import {donors,requests,inventory} from '../data/mockData'
const keys={donors:'lifelink_donors',requests:'lifelink_blood_requests',inventory:'lifelink_inventory',activities:'lifelink_activities',user:'lifelink_user'}
const seedActivities=[{id:'ACT-SEED',type:'system',text:'LifeLink demo data initialized',createdAt:'2026-08-01T09:00:00.000Z'}]
export function initStore(){const seeds={donors,requests:requests.map(r=>({...r,status:r.status==='Open'?'Pending':r.status,createdAt:new Date().toISOString()})),inventory,activities:seedActivities};Object.entries(seeds).forEach(([type,value])=>{if(!localStorage.getItem(keys[type]))localStorage.setItem(keys[type],JSON.stringify(value))})}
export function getStore(type){initStore();return JSON.parse(localStorage.getItem(keys[type])||'[]')}
export function setStore(type,value){localStorage.setItem(keys[type],JSON.stringify(value));window.dispatchEvent(new Event('lifelink-update'))}
export function makeId(prefix){return `${prefix}-${Date.now().toString().slice(-7)}`}
export const getDonors=()=>getStore('donors');export const getBloodRequests=()=>getStore('requests');export const getInventory=()=>getStore('inventory');export const getActivities=()=>getStore('activities')
export function addActivity(type,text){const item={id:makeId('ACT'),type,text,createdAt:new Date().toISOString()};setStore('activities',[item,...getActivities()].slice(0,30));return item}
export function addDonor(donor){setStore('donors',[{...donor,createdAt:new Date().toISOString(),isNew:true},...getDonors()]);addActivity('donor',`New donor registered: ${donor.name}`)}
export function addBloodRequest(request){setStore('requests',[request,...getBloodRequests()]);addActivity(request.urgency==='Emergency'?'emergency':'request',`${request.urgency==='Emergency'?'Emergency request created':'Blood request submitted'}: ${request.id}`)}
export function updateBloodRequest(id,patch){const updated=getBloodRequests().map(r=>r.id===id?{...r,...patch,updatedAt:new Date().toISOString()}:r);setStore('requests',updated);addActivity('request',`Request ${id} status updated to ${patch.status}`)}
export function updateInventory(index,units){const data=getInventory().map((item,i)=>i===index?{...item,units:Math.max(0,Number(units)||0),updated:'Just now'}:item);setStore('inventory',data);addActivity('inventory',`Inventory updated for ${data[index].blood}`)}
export const isAdmin=()=>localStorage.getItem('lifelink_admin_session')==='true'
export const startAdminSession=()=>localStorage.setItem('lifelink_admin_session','true')
export const endAdminSession=()=>localStorage.removeItem('lifelink_admin_session')
