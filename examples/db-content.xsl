<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
   xmlns:xs="http://www.w3.org/2001/XMLSchema"
   xmlns:db="http://docbook.org/ns/docbook"
   xmlns:m="http://www.w3.org/1998/Math/MathML"
   xmlns:xlink="http://www.w3.org/1999/xlink"
   exclude-result-prefixes="xs db m"
   version="2.0">
   
<xsl:template match="/db:*">
   <xsl:element name="db-{local-name()}" namespace="http://www.w3.org/1999/xhtml">
      <xsl:attribute name="typeof"><xsl:value-of select="namespace-uri()"/></xsl:attribute>
      <xsl:apply-templates select="@*|node()"/>
   </xsl:element>
</xsl:template>
   
<xsl:template match="db:*">
   <xsl:element name="db-{local-name()}" namespace="http://www.w3.org/1999/xhtml">
      <xsl:apply-templates select="@*|node()"/>
   </xsl:element>
</xsl:template>
   
<xsl:template match="m:*">
   <xsl:element name="{local-name()}" namespace="http://www.w3.org/1999/xhtml">
      <xsl:apply-templates select="@*|node()"/>
   </xsl:element>
</xsl:template>
   
<xsl:template match="@xml:id">
   <xsl:attribute name="id"><xsl:value-of select="."/></xsl:attribute>
</xsl:template>

<xsl:template match="@xlink:*">
   <xsl:attribute name="{local-name()}"><xsl:value-of select="."/></xsl:attribute>
</xsl:template>
   
<xsl:template match="@*">
   <xsl:copy-of select="."/>
</xsl:template>
   
</xsl:stylesheet>