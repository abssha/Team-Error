import { Appliance } from '../models/Appliance.js';
import { Room } from '../models/Room.js';
import { Settings } from '../models/Settings.js';

export async function buildSystemPrompt() {
  const rooms = await Room.find().sort({ createdAt: 1 });
  const appliances = await Appliance.find();
  const rateSetting = await Settings.findOne({ key: 'ratePerUnit' });
  const ratePerUnit = rateSetting?.value ?? 8;

  let inventorySummary = '';
  if (rooms.length === 0) {
    inventorySummary = 'No rooms or appliances have been added yet.';
  } else {
    inventorySummary = rooms.map(room => {
      const roomAppliances = appliances.filter(a => a.room_id.toString() === room._id.toString());
      if (roomAppliances.length === 0) return `Room: ${room.name} — no appliances added`;
      const appList = roomAppliances.map(a => {
        const activeEnergy = ((a.wattage * a.quantity * a.daily_hours) / 1000).toFixed(3);
        const standbyEnergy = a.standby
          ? ((a.wattage * 0.1 * a.quantity * a.standby_hours) / 1000).toFixed(3)
          : '0';
        return `  - ${a.name} (x${a.quantity}): ${a.wattage}W, ${a.daily_hours}h/day = ${activeEnergy} kWh/day, standby: ${standbyEnergy} kWh/day`;
      }).join('\n');
      return `Room: ${room.name}\n${appList}`;
    }).join('\n\n');
  }

  const totalDailyKwh = appliances.reduce((sum, a) => {
    const active = (a.wattage * a.quantity * a.daily_hours) / 1000;
    const standby = a.standby ? (a.wattage * 0.1 * a.quantity * a.standby_hours) / 1000 : 0;
    return sum + active + standby;
  }, 0);

  const monthlyKwh = totalDailyKwh * 30;
  const monthlyCost = monthlyKwh * ratePerUnit;

  return `You are an AI energy advisor for Phantom Load — a home energy audit app.

Your job is to help users understand their electricity consumption, identify energy-wasting appliances, and give practical advice to reduce their bills.

## Current Home Inventory
${inventorySummary}

## Summary Stats
- Total daily consumption: ${totalDailyKwh.toFixed(3)} kWh/day
- Estimated monthly consumption: ${monthlyKwh.toFixed(1)} kWh/month
- Electricity rate: ₹${ratePerUnit}/unit
- Estimated monthly cost: ₹${monthlyCost.toFixed(0)}

## Your Behavior
- Be concise and conversational — this is a chat interface
- Give specific, actionable advice based on the actual inventory above
- If no appliances are added yet, encourage the user to add some
- Highlight phantom load / standby power issues when relevant
- Use ₹ for currency, kWh for energy
- Keep responses under 150 words unless a detailed breakdown is requested`;
}