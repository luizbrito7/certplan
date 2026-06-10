-- Seed curated certifications catalog
INSERT INTO public.certifications (name, vendor, code, slug, is_custom) VALUES
  -- AWS
  ('AWS Cloud Practitioner',                   'aws', 'CLF-C02', 'aws-clf-c02',  false),
  ('AWS Solutions Architect Associate',         'aws', 'SAA-C03', 'aws-saa-c03',  false),
  ('AWS Solutions Architect Professional',      'aws', 'SAP-C02', 'aws-sap-c02',  false),
  ('AWS Developer Associate',                   'aws', 'DVA-C02', 'aws-dva-c02',  false),
  ('AWS SysOps Administrator Associate',        'aws', 'SOA-C02', 'aws-soa-c02',  false),
  ('AWS DevOps Engineer Professional',          'aws', 'DOP-C02', 'aws-dop-c02',  false),
  ('AWS Advanced Networking Specialty',         'aws', 'ANS-C01', 'aws-ans-c01',  false),
  ('AWS Machine Learning Specialty',            'aws', 'MLS-C01', 'aws-mls-c01',  false),
  ('AWS Security Specialty',                    'aws', 'SCS-C02', 'aws-scs-c02',  false),
  -- Azure
  ('Azure Fundamentals',                        'azure', 'AZ-900',  'azure-az-900',  false),
  ('Azure Administrator',                       'azure', 'AZ-104',  'azure-az-104',  false),
  ('Azure Developer Associate',                 'azure', 'AZ-204',  'azure-az-204',  false),
  ('Azure Solutions Architect Expert',          'azure', 'AZ-305',  'azure-az-305',  false),
  ('Azure DevOps Engineer Expert',              'azure', 'AZ-400',  'azure-az-400',  false),
  ('Azure AI Fundamentals',                     'azure', 'AI-900',  'azure-ai-900',  false),
  ('Azure Data Fundamentals',                   'azure', 'DP-900',  'azure-dp-900',  false),
  ('Security, Compliance, and Identity Fundamentals', 'azure', 'SC-900', 'azure-sc-900', false),
  -- Cisco
  ('CCNA',                                      'cisco', '200-301', 'cisco-ccna',    false),
  ('CCNP Enterprise Core',                      'cisco', '350-401', 'cisco-encor',   false),
  -- Kubernetes / CNCF
  ('Certified Kubernetes Administrator',        'kubernetes', 'CKA',  'cncf-cka',  false),
  ('Certified Kubernetes Application Developer','kubernetes', 'CKAD', 'cncf-ckad', false),
  ('Certified Kubernetes Security Specialist',  'kubernetes', 'CKS',  'cncf-cks',  false),
  -- GCP
  ('Cloud Digital Leader',                      'gcp', 'CDL', 'gcp-cdl', false),
  ('Associate Cloud Engineer',                  'gcp', 'ACE', 'gcp-ace', false),
  ('Professional Cloud Architect',              'gcp', 'PCA', 'gcp-pca', false),
  ('Professional Data Engineer',                'gcp', 'PDE', 'gcp-pde', false),
  -- Other
  ('CompTIA Security+',   'other', 'SY0-701', 'comptia-security-plus', false),
  ('CompTIA Network+',    'other', 'N10-009', 'comptia-network-plus',  false),
  ('CompTIA A+',          'other', '220-1101','comptia-a-plus',         false),
  ('HashiCorp Terraform Associate', 'other', 'TA-003', 'hashicorp-terraform-associate', false),
  ('HashiCorp Vault Associate',     'other', 'VA-003', 'hashicorp-vault-associate',     false)
ON CONFLICT (slug) DO NOTHING;
