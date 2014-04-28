<?xml version="1.0" encoding="UTF-8"?>
<p:declare-step xmlns:p="http://www.w3.org/ns/xproc"
    xmlns:c="http://www.w3.org/ns/xproc-step" version="1.0"
    xmlns:h="http://www.w3.org/1999/xhtml"
   name="top">
   <p:input port="source"/>
   <p:output port="result"/>
   <p:viewport match="h:content">
      <p:viewport-source>
         <p:document href="wrapper.xhtml"/>
      </p:viewport-source>
      <p:xslt>
         <p:input port="source">
            <p:pipe port="source" step="top"/>
         </p:input>
         <p:input port="parameters"><p:empty/></p:input>
         <p:input port="stylesheet">
            <p:document href="db-content.xsl"/>
         </p:input>
      </p:xslt>
   </p:viewport>
    
</p:declare-step>