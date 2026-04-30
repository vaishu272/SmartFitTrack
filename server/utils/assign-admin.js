import { User } from "../models/user-model.js";

export async function assignSingleAdminFromEnv() {
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD;
  const adminName = process.env.ADMIN_NAME?.trim() || "Admin";

  if (!adminEmail) {
    console.log("ADMIN_EMAIL not set. Skipping admin setup.");
    return;
  }

  let targetAdmin = await User.findOne({ email: adminEmail });

  if (!targetAdmin) {
    if (!adminPassword) {
      console.log("ADMIN_PASSWORD not set. Cannot create designated admin.");
      return;
    }

    // Free the single-admin slot before creating the designated account.
    await User.updateMany({ role: "admin" }, { $set: { role: "user" } });

    targetAdmin = await User.create({
      name: adminName,
      email: adminEmail,
      password: adminPassword,
      role: "admin",
      isEmailVerified: true,
    });
    console.log(`Designated admin created: ${targetAdmin.email}`);
  }

  // Keep exactly one admin account.
  await User.updateMany(
    { _id: { $ne: targetAdmin._id }, role: "admin" },
    { $set: { role: "user" } },
  );

  if (targetAdmin.role !== "admin" || !targetAdmin.isEmailVerified) {
    targetAdmin.role = "admin";
    targetAdmin.isEmailVerified = true;
    await targetAdmin.save();
    console.log(`Admin role assigned to ${targetAdmin.email}`);
    return;
  }

  console.log(`Designated admin already active: ${targetAdmin.email}`);
}
