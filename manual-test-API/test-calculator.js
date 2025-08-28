// Test file to verify fare calculation logic
function calculateFare(distanceKm) {
  let totalFare = 0;
  let breakdownText = '';

  if (distanceKm >= 1 && distanceKm <= 2) {
    // 1km to 2km: 50 pesos (base fare)
    totalFare = 50;
    breakdownText = `Base fare (1-2km): ₱50.00`;
  } else if (distanceKm >= 3 && distanceKm <= 8) {
    // 3km to 8km: 50 pesos base + (distance - 2) × 10 pesos
    const additionalKm = distanceKm - 2;
    const additionalFare = additionalKm * 10;
    totalFare = 50 + additionalFare;
    breakdownText = `Base fare: ₱50.00\nAdditional ${additionalKm.toFixed(2)}km × ₱10.00 = ₱${additionalFare.toFixed(2)}`;
  } else if (distanceKm >= 9) {
    // 9km and above: 50 pesos base + (6 × 10 pesos) + (distance - 8) × 12 pesos
    const tier1Km = 6; // 3-8km range (6km total)
    const tier1Fare = tier1Km * 10;
    const tier2Km = distanceKm - 8;
    const tier2Fare = tier2Km * 12;
    totalFare = 50 + tier1Fare + tier2Fare;
    breakdownText = `Base fare: ₱50.00\n3-8km (${tier1Km}km) × ₱10.00 = ₱${tier1Fare.toFixed(2)}\n9km+ (${tier2Km.toFixed(2)}km) × ₱12.00 = ₱${tier2Fare.toFixed(2)}`;
  }

  return { fare: totalFare, breakdown: breakdownText };
}

// Test cases from the specification
const testCases = [
  { distance: 2, expected: 50 },
  { distance: 3, expected: 60 },
  { distance: 4, expected: 70 },
  { distance: 5, expected: 80 },
  { distance: 6, expected: 90 },
  { distance: 7, expected: 100 },
  { distance: 8, expected: 110 },
  { distance: 9, expected: 122 },
  { distance: 9.740, expected: 130.88 }
];

console.log('Testing MC Taxi Fare Calculator\n');
console.log('Distance | Expected | Calculated | Status');
console.log('---------|----------|------------|--------');

testCases.forEach(test => {
  const result = calculateFare(test.distance);
  const calculated = result.fare;
  const status = Math.abs(calculated - test.expected) < 0.01 ? '✓ PASS' : '✗ FAIL';
  
  console.log(`${test.distance.toString().padEnd(8)} | ${test.expected.toString().padEnd(8)} | ${calculated.toFixed(2).padEnd(10)} | ${status}`);
  
  if (status === '✗ FAIL') {
    console.log(`  Breakdown: ${result.breakdown}`);
  }
});

console.log('\nAll tests completed!');
